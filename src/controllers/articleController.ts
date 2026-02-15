import { Request, Response } from "express";
import * as ArticleService from "@/services/articleService";
import { CreateArticleInput, UpdateArticleInput } from "@/schemas/article";

type IdParams = { id: string };

/**
 * POST /api/articles
 */
export const createArticle = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateArticleInput;
    const article = await ArticleService.createArticle(data);

    res.status(201).json({
      success: true,
      data: article,
      message: "Article created successfully",
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
      message: "Error creating article",
    });
  }
};

/**
 * GET /api/articles
 */
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await ArticleService.getAllArticles();

    res.status(200).json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving articles",
    });
  }
};

/**
 * GET /api/articles/:id
 */
export const getArticleById = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const article = await ArticleService.getArticleById(id);

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving article",
    });
  }
};

/**
 * PUT /api/articles/:id
 */
export const updateArticle = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateArticleInput;
    const article = await ArticleService.updateArticle(id, data);

    res.status(200).json({
      success: true,
      data: article,
      message: "Article updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ARTICLE_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Article not found",
        });
      }

      if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating article",
    });
  }
};

/**
 * DELETE /api/articles/:id
 */
export const deleteArticle = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await ArticleService.deleteArticle(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "ARTICLE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting article",
    });
  }
};

/**
 * GET /api/articles/search?q=query&categoryId=<cuid>
 */
export const searchArticles = async (req: Request, res: Response) => {
  try {
    const filters = (req as any).validatedQuery || {};
    const articles = await ArticleService.searchArticles(filters);

    res.status(200).json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching articles",
    });
  }
};
