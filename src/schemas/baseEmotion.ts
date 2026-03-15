import { z } from "zod";

export const zBaseEmotion = z.object({
  id: z.cuid("ID must be a valid CUID"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  emoji: z
    .string()
    .min(1, "Emoji must not be empty")
    .max(8, "Emoji must not exceed 8 characters")
    .nullable()
    .optional(),
  color: z
    .string()
    .min(3, "Color must not be empty")
    .max(20, "Color must not exceed 20 characters")
    .nullable()
    .optional(),
  score: z
    .number()
    .int("Score must be an integer")
    .min(1, "Score must be at least 1")
    .max(5, "Score must not exceed 5"),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be at least 0"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBaseEmotionSchema = zBaseEmotion.pick({
  name: true,
  emoji: true,
  color: true,
  score: true,
  order: true,
});

export const updateBaseEmotionSchema = zBaseEmotion
  .pick({
    name: true,
    emoji: true,
    color: true,
    score: true,
    order: true,
  })
  .partial();

export const baseEmotionIdSchema = zBaseEmotion.pick({ id: true });

export const searchBaseEmotionSchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
});

export type BaseEmotionResponse = z.infer<typeof zBaseEmotion>;
export type CreateBaseEmotionInput = z.infer<typeof createBaseEmotionSchema>;
export type UpdateBaseEmotionInput = z.infer<typeof updateBaseEmotionSchema>;
export type BaseEmotionIdParam = z.infer<typeof baseEmotionIdSchema>;
export type SearchBaseEmotionQuery = z.infer<typeof searchBaseEmotionSchema>;
