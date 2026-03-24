import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/config/database";
import { hashPassword } from "@/utils/hashPassword";
import {
  createUser,
  getAllUsers,
  getUserById,
  getActiveUsers,
  searchUsers,
  updateUser,
  deactivateUser,
  activateUser,
  acceptGdpr,
  deleteUser,
} from "@/services/userService";

vi.mock("@/config/database", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@/utils/hashPassword", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed-password"),
}));

const prismaMock = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
};

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

const mockAdmin = {
  ...mockUser,
  id: "cuid-admin",
  email: "admin@example.com",
  role: "ADMIN",
};

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // createUser
  // ---------------------------------------------------------------------------
  describe("createUser", () => {
    it("creates a user successfully", async () => {
      prismaMock.user.count.mockResolvedValue(0);
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await createUser({
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        password: "password123",
        role: "USER",
        gdprAccepted: false,
      });

      expect(prismaMock.user.count).toHaveBeenCalledWith({
        where: { email: "jane@example.com" },
      });
      expect(hashPassword).toHaveBeenCalledWith("password123");
      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ password: "hashed-password" }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it("throws EMAIL_ALREADY_EXISTS if email is already taken", async () => {
      prismaMock.user.count.mockResolvedValue(1);

      await expect(
        createUser({
          firstname: "Jane",
          lastname: "Doe",
          email: "jane@example.com",
          password: "password123",
          role: "USER",
          gdprAccepted: false,
        })
      ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
    });

    it("sets gdprAcceptedAt when gdprAccepted is true", async () => {
      prismaMock.user.count.mockResolvedValue(0);
      prismaMock.user.create.mockResolvedValue({
        ...mockUser,
        gdprAcceptedAt: new Date(),
      });

      await createUser({
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        password: "password123",
        role: "USER",
        gdprAccepted: true,
      });

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ gdprAcceptedAt: expect.any(Date) }),
        })
      );
    });

    it("does not set gdprAcceptedAt when gdprAccepted is false", async () => {
      prismaMock.user.count.mockResolvedValue(0);
      prismaMock.user.create.mockResolvedValue(mockUser);

      await createUser({
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        password: "password123",
        role: "USER",
        gdprAccepted: false,
      });

      const createCall = prismaMock.user.create.mock.calls[0][0];
      expect(createCall.data.gdprAcceptedAt).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // getAllUsers
  // ---------------------------------------------------------------------------
  describe("getAllUsers", () => {
    it("returns all users ordered by createdAt desc", async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await getAllUsers();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: "desc" } })
      );
      expect(result).toEqual([mockUser]);
    });
  });

  // ---------------------------------------------------------------------------
  // getUserById
  // ---------------------------------------------------------------------------
  describe("getUserById", () => {
    it("returns the user matching the given id", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserById("cuid-1");

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "cuid-1" } })
      );
      expect(result).toEqual(mockUser);
    });

    it("throws USER_NOT_FOUND when no user matches the id", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(getUserById("non-existent")).rejects.toThrow("USER_NOT_FOUND");
    });
  });

  // ---------------------------------------------------------------------------
  // getActiveUsers
  // ---------------------------------------------------------------------------
  describe("getActiveUsers", () => {
    it("returns only active users", async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await getActiveUsers();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } })
      );
      expect(result).toEqual([mockUser]);
    });
  });

  // ---------------------------------------------------------------------------
  // searchUsers
  // ---------------------------------------------------------------------------
  describe("searchUsers", () => {
    it("returns all users when no filters are provided", async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await searchUsers({});

      const callArg = prismaMock.user.findMany.mock.calls[0][0];
      expect(callArg.where).toBeUndefined();
      expect(result).toEqual([mockUser]);
    });

    it("applies filters when criteria are provided", async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await searchUsers({ q: "jane", role: "USER", isActive: true });

      const callArg = prismaMock.user.findMany.mock.calls[0][0];
      expect(callArg.where).toBeDefined();
      expect(result).toEqual([mockUser]);
    });
  });

  // ---------------------------------------------------------------------------
  // updateUser
  // ---------------------------------------------------------------------------
  describe("updateUser", () => {
    it("updates a user successfully", async () => {
      const updated = { ...mockUser, firstname: "Updated" };
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue(updated);

      const result = await updateUser("cuid-1", { firstname: "Updated" });

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "cuid-1" } })
      );
      expect(result).toEqual(updated);
    });

    it("throws USER_NOT_FOUND when user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(updateUser("non-existent", { firstname: "New" })).rejects.toThrow(
        "USER_NOT_FOUND"
      );
    });

    it("throws EMAIL_ALREADY_EXISTS when the new email is taken by another user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.count.mockResolvedValue(1);

      await expect(
        updateUser("cuid-1", { email: "taken@example.com" })
      ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
    });

    it("hashes the new password when it is updated", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue(mockUser);

      await updateUser("cuid-1", { password: "newpassword" });

      expect(hashPassword).toHaveBeenCalledWith("newpassword");
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ password: "hashed-password" }),
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // deactivateUser
  // ---------------------------------------------------------------------------
  describe("deactivateUser", () => {
    it("deactivates a regular user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue({ ...mockUser, isActive: false });

      const result = await deactivateUser("cuid-1");

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: false } })
      );
      expect(result.isActive).toBe(false);
    });

    it("throws USER_NOT_FOUND when user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(deactivateUser("non-existent")).rejects.toThrow("USER_NOT_FOUND");
    });

    it("throws CANNOT_DEACTIVATE_LAST_ADMIN when deactivating the sole admin", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
      prismaMock.user.count.mockResolvedValue(1);

      await expect(deactivateUser("cuid-admin")).rejects.toThrow(
        "CANNOT_DEACTIVATE_LAST_ADMIN"
      );
    });

    it("allows deactivating an admin when other admins exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
      prismaMock.user.count.mockResolvedValue(2);
      prismaMock.user.update.mockResolvedValue({ ...mockAdmin, isActive: false });

      const result = await deactivateUser("cuid-admin");

      expect(result.isActive).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // activateUser
  // ---------------------------------------------------------------------------
  describe("activateUser", () => {
    it("activates an inactive user", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false });
      prismaMock.user.update.mockResolvedValue(mockUser);

      const result = await activateUser("cuid-1");

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: true } })
      );
      expect(result.isActive).toBe(true);
    });

    it("throws USER_NOT_FOUND when user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(activateUser("non-existent")).rejects.toThrow("USER_NOT_FOUND");
    });
  });

  // ---------------------------------------------------------------------------
  // acceptGdpr
  // ---------------------------------------------------------------------------
  describe("acceptGdpr", () => {
    it("sets gdprAcceptedAt on the user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.update.mockResolvedValue({
        ...mockUser,
        gdprAcceptedAt: new Date(),
      });

      const result = await acceptGdpr("cuid-1");

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "cuid-1" },
          data: { gdprAcceptedAt: expect.any(Date) },
        })
      );
      expect(result.gdprAcceptedAt).toBeTruthy();
    });

    it("throws USER_NOT_FOUND when user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(acceptGdpr("non-existent")).rejects.toThrow("USER_NOT_FOUND");
    });
  });

  // ---------------------------------------------------------------------------
  // deleteUser
  // ---------------------------------------------------------------------------
  describe("deleteUser", () => {
    it("deletes a regular user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.user.delete.mockResolvedValue(mockUser);

      await deleteUser("cuid-1");

      expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: "cuid-1" } });
    });

    it("throws USER_NOT_FOUND when user does not exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(deleteUser("non-existent")).rejects.toThrow("USER_NOT_FOUND");
    });

    it("throws CANNOT_DELETE_LAST_ADMIN when deleting the sole admin", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
      prismaMock.user.count.mockResolvedValue(1);

      await expect(deleteUser("cuid-admin")).rejects.toThrow("CANNOT_DELETE_LAST_ADMIN");
    });

    it("allows deleting an admin when other admins exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockAdmin);
      prismaMock.user.count.mockResolvedValue(2);
      prismaMock.user.delete.mockResolvedValue(mockAdmin);

      await expect(deleteUser("cuid-admin")).resolves.toBeUndefined();
    });
  });
});
