import { prisma } from "@/config/database";
import { Role } from "@/generated/prisma";
import {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  SearchUserQuery,
} from "@/schemas/user";

export const createUser = async (
  data: CreateUserInput
): Promise<UserResponse> => {
  return await prisma.user.create({
    data,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findAllUsers = async (): Promise<UserResponse[]> => {
  return await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findUserById = async (
  id: number
): Promise<UserResponse | null> => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput
): Promise<UserResponse> => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteUser = async (id: number): Promise<UserResponse> => {
  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const searchUsers = async (
  filters: SearchUserQuery
): Promise<UserResponse[]> => {
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
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findAllActiveUsers = async (): Promise<UserResponse[]> => {
  return await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findUsersByRole = async (role: Role): Promise<UserResponse[]> => {
  return await prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await prisma.user.count({
    where: { email },
  });
  return count > 0;
};

export const existsById = async (id: number): Promise<boolean> => {
  const count = await prisma.user.count({
    where: { id },
  });
  return count > 0;
};

export const findUserByEmailWithPassword = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      ...{
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      password: true,
    },
  });
};

export const countUsers = async (): Promise<number> => {
  return await prisma.user.count();
};

export const countUsersByRole = async (role: Role): Promise<number> => {
  return await prisma.user.count({
    where: { role },
  });
};

export const countActiveUsers = async (): Promise<number> => {
  return await prisma.user.count({
    where: { isActive: true },
  });
};
