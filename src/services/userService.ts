import { prisma } from "@/config/database";
import { USER_SELECT } from "@/constants/prismaSelects";
import {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  SearchUserQuery,
} from "@/schemas/user";
import { hashPassword } from "@/utils/hashPassword";
import { Role } from "@/generated/prisma";

export const createUser = async (
  data: CreateUserInput
): Promise<UserResponse> => {
  const emailExists = await prisma.user.count({
    where: { email: data.email },
  }) > 0;

  if (emailExists) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await hashPassword(data.password);

  const { gdprAccepted, ...userData } = data;

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      ...(gdprAccepted ? { gdprAcceptedAt: new Date() } : {}),
    },
    select: USER_SELECT,
  });

  return user;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  return await prisma.user.findMany({
    select: USER_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const getActiveUsers = async (): Promise<UserResponse[]> => {
  return await prisma.user.findMany({
    where: { isActive: true },
    select: USER_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const searchUsers = async (
  filters: SearchUserQuery
): Promise<UserResponse[]> => {
  if (!filters.q && !filters.role && filters.isActive === undefined) {
    return await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
    });
  }

  const { q, role, isActive } = filters;

  return await prisma.user.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { firstname: { contains: q, mode: "insensitive" } },
                { lastname: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        role ? { role } : {},
        isActive !== undefined ? { isActive } : {},
      ],
    },
    select: USER_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const updateUser = async (
  id: string,
  data: UpdateUserInput
): Promise<UserResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.count({
      where: { email: data.email },
    }) > 0;

    if (emailExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  const updateData: UpdateUserInput = { ...data };
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
    select: USER_SELECT,
  });

  return updatedUser;
};

export const deactivateUser = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({
      where: { role: Role.ADMIN },
    });

    if (adminCount <= 1) {
      throw new Error("CANNOT_DEACTIVATE_LAST_ADMIN");
    }
  }

  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: USER_SELECT,
  });
};

export const activateUser = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return await prisma.user.update({
    where: { id },
    data: { isActive: true },
    select: USER_SELECT,
  });
};

export const acceptGdpr = async (id: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return await prisma.user.update({
    where: { id },
    data: { gdprAcceptedAt: new Date() },
    select: USER_SELECT,
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Prevent deleting the last admin
  if (user.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({
      where: { role: Role.ADMIN },
    });

    if (adminCount <= 1) {
      throw new Error("CANNOT_DELETE_LAST_ADMIN");
    }
  }

  await prisma.user.delete({
    where: { id },
  });
};
