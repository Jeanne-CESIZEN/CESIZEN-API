import { Request, Response } from "express";
import * as CategoryService from "@/services/categoryService";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/validators/categoryValidator";

/**
 * POST /api/categories
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateCategoryInput;
    const category = await CategoryService.createCategory(data);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CATEGORY_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "A category with this name already exists",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error creating category",
    });
  }
};

/**
 * GET /api/categories
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving categories",
    });
  }
};

/**
 * GET /api/categories/:id
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(Number(id));

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving category",
    });
  }
};

/**
 * PUT /api/categories/:id
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateCategoryInput;

    const category = await CategoryService.updateCategory(Number(id), data);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      if (error.message === "CATEGORY_NAME_ALREADY_EXISTS") {
        return res.status(409).json({
          success: false,
          message: "A category with this name already exists",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating category",
    });
  }
};

/**
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategory(Number(id));

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting category",
    });
  }
};

/**
 * GET /api/categories/search?q=query
 */
export const searchCategories = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const categories = await CategoryService.searchCategories(
      (q as string) || ""
    );

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching categories",
    });
  }
};
