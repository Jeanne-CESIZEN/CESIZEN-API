import { z } from "zod";

export const zArticle = z.object({
  id: z.number(),
  categoryId: z.number().int().positive(),
  title: z.string().min(2, "Title must be at least 2 characters").trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  content: z.string().min(1, "Content is required"),
  imagePath: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createArticleSchema = zArticle.pick({
  categoryId: true,
  title: true,
  description: true,
  content: true,
  imagePath: true,
});

export const updateArticleSchema = zArticle
  .pick({
    categoryId: true,
    title: true,
    description: true,
    content: true,
    imagePath: true,
  })
  .partial();

export const articleIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
});

export const searchArticleSchema = z.object({
  q: z.string().trim().min(1, "Search query must not be empty").optional(),
  categoryId: z
    .string()
    .regex(/^\d+$/, "Category ID must be a valid number")
    .transform(Number)
    .optional(),
});

export type ArticleResponse = z.infer<typeof zArticle>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleIdParam = z.infer<typeof articleIdSchema>;
export type SearchArticleQuery = z.infer<typeof searchArticleSchema>;
