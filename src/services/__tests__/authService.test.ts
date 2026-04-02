import { describe, it, expect, vi, beforeEach } from "vitest";
import argon2 from "argon2";
import bcrypt from "bcrypt";
import { prisma } from "@/config/database";
import {
  login,
  refresh,
  logout,
  getAuthenticatedUser,
} from "@/services/authService";

vi.mock("@/config/database", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

// Typed references for convenience
import jwt from "jsonwebtoken";

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  refreshToken: {
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};
const jwtMock = jwt as unknown as {
  sign: ReturnType<typeof vi.fn>;
  verify: ReturnType<typeof vi.fn>;
};

const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_REFRESH_TOKEN = "mock-refresh-token";
const PASSWORD_SALT_ROUNDS = 4;

const mockUser = {
  id: "cuid-1",
  firstname: "Jane",
  lastname: "Doe",
  email: "jane@example.com",
  role: "USER",
  isActive: true,
  gdprAcceptedAt: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const createUserWithPassword = async (password: string) => ({
  ...mockUser,
  password: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS),
  tokenVersion: 1,
});

const createStoredRefreshToken = async (
  refreshToken: string,
  overrides: Partial<{
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }> = {}
) => ({
  id: "token-id",
  userId: "cuid-1",
  tokenHash: await argon2.hash(refreshToken),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    jwtMock.sign.mockImplementation((payload?: { type?: string }) =>
      payload?.type === "access" ? MOCK_ACCESS_TOKEN : MOCK_REFRESH_TOKEN
    );
    prismaMock.refreshToken.create.mockImplementation(async ({ data }) => ({
      ...data,
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  });

  // ---------------------------------------------------------------------------
  // login
  // ---------------------------------------------------------------------------
  describe("login", () => {
    it("returns tokens and user on valid credentials", async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        await createUserWithPassword("password123")
      );

      const result = await login({
        email: "jane@example.com",
        password: "password123",
      });

      expect(result.user).toMatchObject({
        id: "cuid-1",
        email: "jane@example.com",
      });
      expect(result.accessToken).toBe(MOCK_ACCESS_TOKEN);
      expect(result.refreshToken).toBe(MOCK_REFRESH_TOKEN);
      expect(result.user).not.toHaveProperty("password");
      expect(result.user).not.toHaveProperty("tokenVersion");
      expect(prismaMock.refreshToken.create).toHaveBeenCalledOnce();

      const refreshTokenCreateInput =
        prismaMock.refreshToken.create.mock.calls[0]?.[0];

      expect(refreshTokenCreateInput.data.tokenHash).not.toBe(
        MOCK_REFRESH_TOKEN
      );
      await expect(
        argon2.verify(
          refreshTokenCreateInput.data.tokenHash,
          MOCK_REFRESH_TOKEN
        )
      ).resolves.toBe(true);
    });

    it("throws INVALID_CREDENTIALS when user is not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        login({ email: "unknown@example.com", password: "password" })
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });

    it("throws USER_INACTIVE when the account is disabled", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...(await createUserWithPassword("password123")),
        isActive: false,
      });

      await expect(
        login({ email: "jane@example.com", password: "password123" })
      ).rejects.toThrow("USER_INACTIVE");
    });

    it("throws INVALID_CREDENTIALS when the password is incorrect", async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        await createUserWithPassword("password123")
      );

      await expect(
        login({ email: "jane@example.com", password: "wrong-password" })
      ).rejects.toThrow("INVALID_CREDENTIALS");
    });
  });

  // ---------------------------------------------------------------------------
  // refresh
  // ---------------------------------------------------------------------------
  describe("refresh", () => {
    const validPayload = {
      sub: "cuid-1",
      type: "refresh",
      tokenId: "token-id",
    };

    it("returns new token pair on a valid refresh token", async () => {
      const storedRefreshToken = await createStoredRefreshToken(
        "valid-refresh-token"
      );

      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        tokenVersion: 1,
      });
      prismaMock.refreshToken.update.mockResolvedValue({
        ...storedRefreshToken,
        revokedAt: new Date(),
      });

      const result = await refresh({ refreshToken: "valid-refresh-token" });

      expect(result.user).toMatchObject({ id: "cuid-1" });
      expect(result.accessToken).toBe(MOCK_ACCESS_TOKEN);
      expect(result.refreshToken).toBe(MOCK_REFRESH_TOKEN);
      expect(result.user).not.toHaveProperty("tokenVersion");
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: storedRefreshToken.id },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        })
      );

      const refreshTokenCreateInput =
        prismaMock.refreshToken.create.mock.calls[0]?.[0];

      await expect(
        argon2.verify(
          refreshTokenCreateInput.data.tokenHash,
          MOCK_REFRESH_TOKEN
        )
      ).resolves.toBe(true);
    });

    it("throws INVALID_REFRESH_TOKEN when jwt.verify fails", async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new Error("invalid signature");
      });

      await expect(refresh({ refreshToken: "bad-token" })).rejects.toThrow(
        "INVALID_REFRESH_TOKEN"
      );
    });

    it("throws INVALID_REFRESH_TOKEN when token type is not 'refresh'", async () => {
      jwtMock.verify.mockReturnValue({
        sub: "cuid-1",
        type: "access",
        tokenId: "token-id",
      });

      await expect(refresh({ refreshToken: "access-token" })).rejects.toThrow(
        "INVALID_REFRESH_TOKEN"
      );
    });

    it("throws INVALID_REFRESH_TOKEN when stored token is not found", async () => {
      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);

      await expect(refresh({ refreshToken: "token" })).rejects.toThrow(
        "INVALID_REFRESH_TOKEN"
      );
    });

    it("throws INVALID_REFRESH_TOKEN when the token hash does not match", async () => {
      const storedRefreshToken = await createStoredRefreshToken(
        "different-refresh-token"
      );

      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);

      await expect(refresh({ refreshToken: "tampered-token" })).rejects.toThrow(
        "INVALID_REFRESH_TOKEN"
      );
    });

    it("throws INVALID_REFRESH_TOKEN when the token has been revoked", async () => {
      const storedRefreshToken = await createStoredRefreshToken(
        "revoked-token",
        {
          revokedAt: new Date(),
        }
      );

      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);

      await expect(refresh({ refreshToken: "revoked-token" })).rejects.toThrow(
        "INVALID_REFRESH_TOKEN"
      );
    });

    it("throws INVALID_REFRESH_TOKEN when the token has expired", async () => {
      const storedRefreshToken = await createStoredRefreshToken(
        "expired-token",
        {
          expiresAt: new Date(Date.now() - 1000),
        }
      );

      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);

      await expect(refresh({ refreshToken: "expired-token" })).rejects.toThrow(
        "INVALID_REFRESH_TOKEN"
      );
    });

    it("throws USER_NOT_FOUND when the user has been deleted", async () => {
      const storedRefreshToken = await createStoredRefreshToken("token");

      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(refresh({ refreshToken: "token" })).rejects.toThrow(
        "USER_NOT_FOUND"
      );
    });

    it("throws USER_INACTIVE when the user account is disabled", async () => {
      const storedRefreshToken = await createStoredRefreshToken("token");

      jwtMock.verify.mockReturnValue(validPayload);
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        isActive: false,
        tokenVersion: 1,
      });

      await expect(refresh({ refreshToken: "token" })).rejects.toThrow(
        "USER_INACTIVE"
      );
    });
  });

  // ---------------------------------------------------------------------------
  // logout
  // ---------------------------------------------------------------------------
  describe("logout", () => {
    it("revokes the token and increments tokenVersion on valid logout", async () => {
      const storedRefreshToken = await createStoredRefreshToken("valid-token");

      jwtMock.verify.mockReturnValue({ type: "refresh", tokenId: "token-id" });
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);
      prismaMock.$transaction.mockResolvedValue([{}, {}]);

      await expect(
        logout({ refreshToken: "valid-token" })
      ).resolves.toBeUndefined();
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: storedRefreshToken.id },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        })
      );
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: storedRefreshToken.userId },
        data: {
          tokenVersion: {
            increment: 1,
          },
        },
      });
    });

    it("completes silently when jwt.verify throws", async () => {
      jwtMock.verify.mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(
        logout({ refreshToken: "bad-token" })
      ).resolves.toBeUndefined();
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("completes silently when the stored token is not found", async () => {
      jwtMock.verify.mockReturnValue({ type: "refresh", tokenId: "token-id" });
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);

      await expect(
        logout({ refreshToken: "unknown-token" })
      ).resolves.toBeUndefined();
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("completes silently when the token is already revoked", async () => {
      const storedRefreshToken = await createStoredRefreshToken(
        "revoked-token",
        {
          revokedAt: new Date(),
        }
      );

      jwtMock.verify.mockReturnValue({ type: "refresh", tokenId: "token-id" });
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);

      await expect(
        logout({ refreshToken: "revoked-token" })
      ).resolves.toBeUndefined();
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it("completes silently when the token hash does not match", async () => {
      const storedRefreshToken = await createStoredRefreshToken(
        "different-token"
      );

      jwtMock.verify.mockReturnValue({ type: "refresh", tokenId: "token-id" });
      prismaMock.refreshToken.findUnique.mockResolvedValue(storedRefreshToken);

      await expect(
        logout({ refreshToken: "tampered-token" })
      ).resolves.toBeUndefined();
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // getAuthenticatedUser
  // ---------------------------------------------------------------------------
  describe("getAuthenticatedUser", () => {
    it("returns the authenticated user by id", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getAuthenticatedUser("cuid-1");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "cuid-1" } })
      );
      expect(result).toEqual(mockUser);
    });

    it("throws USER_NOT_FOUND when user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(getAuthenticatedUser("non-existent")).rejects.toThrow(
        "USER_NOT_FOUND"
      );
    });
  });
});
