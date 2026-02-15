import { prisma } from "@/config/database";
import { CATEGORY_SELECT } from "@/constants/prismaSelects";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryResponse,
} from "@/schemas/category";

export const createCategory = async (
  data: CreateCategoryInput
): Promise<CategoryResponse> => {
  const nameExists = await prisma.category.findUnique({
    where: { name: data.name },
    select: { id: true },
  });

  if (nameExists) {
    throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
  }

  const category = await prisma.category.create({
    data,
    select: CATEGORY_SELECT,
  });

  return category;
};

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  return await prisma.category.findMany({
    select: CATEGORY_SELECT,
    orderBy: { name: "asc" },
  });
};

export const getCategoryById = async (
  id: string
): Promise<CategoryResponse> => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: CATEGORY_SELECT,
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryInput
): Promise<CategoryResponse> => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    select: CATEGORY_SELECT,
  });

  if (!existingCategory) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (data.name && data.name !== existingCategory.name) {
    const nameExists = await prisma.category.findUnique({
      where: { name: data.name },
      select: { id: true },
    });

    if (nameExists) {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
    select: CATEGORY_SELECT,
  });

  return updatedCategory;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  await prisma.category.delete({
    where: { id },
  });
};

export const searchCategories = async (
  query: string
): Promise<CategoryResponse[]> => {
  if (!query || query.trim().length === 0) {
    return await prisma.category.findMany({
      select: CATEGORY_SELECT,
      orderBy: { name: "asc" },
    });
  }

  return await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: query.trim(), mode: "insensitive" } },
        { description: { contains: query.trim(), mode: "insensitive" } },
      ],
    },
    select: CATEGORY_SELECT,
    orderBy: { name: "asc" },
  });
};
