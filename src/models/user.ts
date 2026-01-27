import { prisma } from "@/config/database";
import { Role, Prisma } from "@/generated/prisma";
import {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
} from "@/validators/userValidator";

export class UserModel {
  static async create(data: CreateUserInput): Promise<UserResponse> {
    return await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        role: data.role,
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
    });
  }

  static async findAll(): Promise<UserResponse[]> {
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
  }

  static async findById(id: number): Promise<UserResponse | null> {
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
  }

  static async update(
    id: number,
    data: Prisma.UserUpdateInput
  ): Promise<UserResponse> {
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
  }

  static async delete(id: number): Promise<UserResponse> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async count(): Promise<number> {
    return await prisma.user.count();
  }

  static async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  static async findAllActive(): Promise<UserResponse[]> {
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
    });
  }

  static async countByRole(role: Role): Promise<number> {
    return await prisma.user.count({
      where: { role },
    });
  }

  static async search(query: string): Promise<UserResponse[]> {
    return await prisma.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query, mode: "insensitive" } },
          { lastname: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
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
    });
  }
}
