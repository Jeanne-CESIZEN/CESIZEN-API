import { z } from "zod";

export const zCategory = z.object({
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCategorySchema = zCategory.pick({
  name: true,
  description: true,
});

export const updateCategorySchema = zCategory
  .pick({
    name: true,
    description: true,
  })
  .partial();

export const categoryIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
});

export const searchCategorySchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
});

export type CategoryResponse = z.infer<typeof zCategory>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdSchema>;
export type SearchCategoryQuery = z.infer<typeof searchCategorySchema>;
