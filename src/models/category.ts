import { prisma } from "@/config/database";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryResponse,
} from "@/schemas/category";

export const create = async (
  data: CreateCategoryInput
): Promise<CategoryResponse> => {
  return await prisma.category.create({
    data,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const findAll = async (): Promise<CategoryResponse[]> => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const findById = async (
  id: number
): Promise<CategoryResponse | null> => {
  return await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const update = async (
  id: number,
  data: UpdateCategoryInput
): Promise<CategoryResponse> => {
  return await prisma.category.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteCategory = async (id: number): Promise<void> => {
  await prisma.category.delete({
    where: { id },
  });
};

export const existsByName = async (name: string): Promise<boolean> => {
  const category = await prisma.category.findUnique({
    where: { name },
    select: { id: true },
  });
  return !!category;
};

export const search = async (query: string): Promise<CategoryResponse[]> => {
  return await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const count = async (): Promise<number> => {
  return await prisma.category.count();
};
