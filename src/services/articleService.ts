import { prisma } from "@/config/database";
import { ARTICLE_SELECT } from "@/constants/prismaSelects";
import {
  ArticleResponse,
  CreateArticleInput,
  SearchArticleQuery,
  UpdateArticleInput,
} from "@/schemas/article";

export const createArticle = async (
  data: CreateArticleInput
): Promise<ArticleResponse> => {
  const categoryExists = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });

  if (!categoryExists) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return await prisma.article.create({
    data,
    select: ARTICLE_SELECT,
  });
};

export const getAllArticles = async (): Promise<ArticleResponse[]> => {
  return await prisma.article.findMany({
    select: ARTICLE_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const getArticleById = async (id: string): Promise<ArticleResponse> => {
  const article = await prisma.article.findUnique({
    where: { id },
    select: ARTICLE_SELECT,
  });

  if (!article) {
    throw new Error("ARTICLE_NOT_FOUND");
  }

  return article;
};

export const updateArticle = async (
  id: string,
  data: UpdateArticleInput
): Promise<ArticleResponse> => {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
    select: ARTICLE_SELECT,
  });

  if (!existingArticle) {
    throw new Error("ARTICLE_NOT_FOUND");
  }

  if (data.categoryId && data.categoryId !== existingArticle.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      throw new Error("CATEGORY_NOT_FOUND");
    }
  }

  return await prisma.article.update({
    where: { id },
    data,
    select: ARTICLE_SELECT,
  });
};

export const deleteArticle = async (id: string): Promise<void> => {
  const article = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!article) {
    throw new Error("ARTICLE_NOT_FOUND");
  }

  await prisma.article.delete({
    where: { id },
  });
};

export const searchArticles = async (
  filters: SearchArticleQuery
): Promise<ArticleResponse[]> => {
  if (!filters.q && filters.categoryId === undefined) {
    return await prisma.article.findMany({
      select: ARTICLE_SELECT,
      orderBy: { createdAt: "desc" },
    });
  }

  const { q, categoryId } = filters;

  return await prisma.article.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId !== undefined ? { categoryId } : {},
      ],
    },
    select: ARTICLE_SELECT,
    orderBy: { createdAt: "desc" },
  });
};
