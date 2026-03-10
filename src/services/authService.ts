import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "@/config/database";
import { authConfig } from "@/config/auth";
import { USER_SELECT, USER_WITH_PASSWORD_SELECT } from "@/constants/prismaSelects";
import { LoginInput, RefreshTokenInput } from "@/schemas/auth";
import { UserResponse } from "@/schemas/user";

type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
};

type AuthLoginResponse = TokenPair & {
  user: UserResponse;
};

type AuthUserForTokens = UserResponse & {
  tokenVersion: number;
};

const hashRefreshTokenBcrypt = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, 10);
};

const issueTokenPair = async (user: AuthUserForTokens): Promise<TokenPair> => {
  const tokenId = crypto.randomUUID();

  const accessToken = jwt.sign(
    {
      sub: user.id,
      type: "access",
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    authConfig.accessTokenSecret,
    { expiresIn: authConfig.accessTokenTtlSeconds }
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      type: "refresh",
      tokenId,
    },
    authConfig.refreshTokenSecret,
    { expiresIn: authConfig.refreshTokenTtlSeconds }
  );

  try {
    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        tokenHash: await hashRefreshTokenBcrypt(refreshToken),
        expiresAt: new Date(
          Date.now() + authConfig.refreshTokenTtlSeconds * 1000
        ),
      },
    });
  } catch {
    throw new Error("REFRESH_TOKEN_STORAGE_NOT_READY");
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: authConfig.accessTokenTtlSeconds,
    refreshTokenExpiresIn: authConfig.refreshTokenTtlSeconds,
  };
};

export const login = async (data: LoginInput): Promise<AuthLoginResponse> => {
  const userWithPassword = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      ...USER_WITH_PASSWORD_SELECT,
      tokenVersion: true,
    },
  });

  if (!userWithPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!userWithPassword.isActive) {
    throw new Error("USER_INACTIVE");
  }

  const isValidPassword = await bcrypt.compare(
    data.password,
    userWithPassword.password
  );

  if (!isValidPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const { password, tokenVersion, ...user } = userWithPassword;
  const tokens = await issueTokenPair({
    ...user,
    tokenVersion,
  });

  return {
    ...tokens,
    user,
  };
};

export const refresh = async (
  data: RefreshTokenInput
): Promise<AuthLoginResponse> => {
  let payload: jwt.JwtPayload;

  try {
    const decoded = jwt.verify(data.refreshToken, authConfig.refreshTokenSecret);
    if (typeof decoded === "string") {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
    payload = decoded;
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  if (
    payload.type !== "refresh" ||
    !payload.sub ||
    typeof payload.sub !== "string" ||
    !payload.tokenId ||
    typeof payload.tokenId !== "string"
  ) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { id: payload.tokenId },
  });

  if (!storedToken) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const isValidRefreshToken = await bcrypt.compare(
    data.refreshToken,
    storedToken.tokenHash
  );

  if (!isValidRefreshToken) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  if (storedToken.userId !== payload.sub) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  if (storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
    select: {
      ...USER_SELECT,
      tokenVersion: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!user.isActive) {
    throw new Error("USER_INACTIVE");
  }

  const { tokenVersion, ...publicUser } = user;

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokenPair({
    ...publicUser,
    tokenVersion,
  });

  return {
    ...tokens,
    user: publicUser,
  };
};

export const logout = async (data: RefreshTokenInput): Promise<void> => {
  try {
    const decoded = jwt.verify(data.refreshToken, authConfig.refreshTokenSecret);
    if (typeof decoded === "string") {
      return;
    }
    if (
      decoded.type !== "refresh" ||
      !decoded.tokenId ||
      typeof decoded.tokenId !== "string"
    ) {
      return;
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { id: decoded.tokenId },
    });

    if (!storedToken || storedToken.revokedAt) {
      return;
    }

    const isValidRefreshToken = await bcrypt.compare(
      data.refreshToken,
      storedToken.tokenHash
    );

    if (!isValidRefreshToken) {
      return;
    }

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: decoded.tokenId },
        data: { revokedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: storedToken.userId },
        data: {
          tokenVersion: {
            increment: 1,
          },
        },
      }),
    ]);
  } catch {
    return;
  }
};

export const getAuthenticatedUser = async (
  userId: string
): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};
