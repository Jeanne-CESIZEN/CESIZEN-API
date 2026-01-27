import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
});

export const searchCategorySchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdSchema>;
export type SearchCategoryQuery = z.infer<typeof searchCategorySchema>;

export type CategoryResponse = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
