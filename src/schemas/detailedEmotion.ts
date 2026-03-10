import { z } from "zod";
import { zBaseEmotion } from "./baseEmotion";

export const zDetailedEmotion = z.object({
  id: z.cuid("ID must be a valid CUID"),
  baseEmotionId: zBaseEmotion.shape.id,
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDetailedEmotionSchema = zDetailedEmotion.pick({
  baseEmotionId: true,
  name: true,
});

export const updateDetailedEmotionSchema = zDetailedEmotion
  .pick({
    baseEmotionId: true,
    name: true,
  })
  .partial();

export const detailedEmotionIdSchema = zDetailedEmotion.pick({ id: true });

export const searchDetailedEmotionSchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
  baseEmotionId: z
    .string()
    .cuid("Base emotion ID must be a valid CUID")
    .optional(),
});

export type DetailedEmotionResponse = z.infer<typeof zDetailedEmotion>;
export type CreateDetailedEmotionInput = z.infer<
  typeof createDetailedEmotionSchema
>;
export type UpdateDetailedEmotionInput = z.infer<
  typeof updateDetailedEmotionSchema
>;
export type DetailedEmotionIdParam = z.infer<typeof detailedEmotionIdSchema>;
export type SearchDetailedEmotionQuery = z.infer<
  typeof searchDetailedEmotionSchema
>;
