import * as CategoryModel from "@/models/category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryResponse,
} from "@/validators/categoryValidator";

export const createCategory = async (
  data: CreateCategoryInput
): Promise<CategoryResponse> => {
  const nameExists = await CategoryModel.existsByName(data.name);
  if (nameExists) {
    throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
  }

  const category = await CategoryModel.create(data);
  return category;
};

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  return await CategoryModel.findAll();
};

export const getCategoryById = async (
  id: number
): Promise<CategoryResponse> => {
  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  return category;
};

export const updateCategory = async (
  id: number,
  data: UpdateCategoryInput
): Promise<CategoryResponse> => {
  const existingCategory = await CategoryModel.findById(id);
  if (!existingCategory) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (data.name && data.name !== existingCategory.name) {
    const nameExists = await CategoryModel.existsByName(data.name);
    if (nameExists) {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    }
  }

  const updatedCategory = await CategoryModel.update(id, data);
  return updatedCategory;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const category = await CategoryModel.findById(id);
  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  await CategoryModel.deleteCategory(id);
};

export const searchCategories = async (
  query: string
): Promise<CategoryResponse[]> => {
  if (!query || query.trim().length === 0) {
    return await CategoryModel.findAll();
  }
  return await CategoryModel.search(query.trim());
};
