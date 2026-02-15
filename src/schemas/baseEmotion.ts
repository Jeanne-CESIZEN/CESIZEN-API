import { z } from "zod";

export const zBaseEmotion = z.object({
  id: z.string().cuid("ID must be a valid CUID"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBaseEmotionSchema = zBaseEmotion.pick({
  name: true,
});

export const updateBaseEmotionSchema = zBaseEmotion
  .pick({
    name: true,
  })
  .partial();

export const baseEmotionIdSchema = z.object({
  id: z.string().cuid("ID must be a valid CUID"),
});

export const searchBaseEmotionSchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
});

export type BaseEmotionResponse = z.infer<typeof zBaseEmotion>;
export type CreateBaseEmotionInput = z.infer<typeof createBaseEmotionSchema>;
export type UpdateBaseEmotionInput = z.infer<typeof updateBaseEmotionSchema>;
export type BaseEmotionIdParam = z.infer<typeof baseEmotionIdSchema>;
export type SearchBaseEmotionQuery = z.infer<typeof searchBaseEmotionSchema>;
