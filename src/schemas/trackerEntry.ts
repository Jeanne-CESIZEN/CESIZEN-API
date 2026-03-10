import { z } from "zod";
import { zUser } from "./user";
import { zDetailedEmotion } from "./detailedEmotion";

export const zTrackerEntry = z.object({
  id: z.cuid("ID must be a valid CUID"),
  userId: zUser.shape.id,
  detailedEmotionId: z
    .string()
    .cuid("Detailed emotion ID must be a valid CUID"),
  comment: z
    .string()
    .max(1000, "Comment must not exceed 1000 characters")
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTrackerEntrySchema = zTrackerEntry.pick({
  userId: true,
  detailedEmotionId: true,
  comment: true,
});

export const updateTrackerEntrySchema = zTrackerEntry
  .pick({
    userId: true,
    detailedEmotionId: true,
    comment: true,
  })
  .partial();

export const trackerEntryIdSchema = zTrackerEntry.pick({ id: true });

export const trackerEntryUserIdSchema = zUser.pick({ id: true });

export const searchTrackerEntrySchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
  userId: zUser.shape.id,
  detailedEmotionId: zDetailedEmotion.shape.id.optional(),
});

export type TrackerEntryResponse = z.infer<typeof zTrackerEntry>;
export type CreateTrackerEntryInput = z.infer<typeof createTrackerEntrySchema>;
export type UpdateTrackerEntryInput = z.infer<typeof updateTrackerEntrySchema>;
export type TrackerEntryIdParam = z.infer<typeof trackerEntryIdSchema>;
export type TrackerEntryUserIdParam = z.infer<typeof trackerEntryUserIdSchema>;
export type SearchTrackerEntryQuery = z.infer<typeof searchTrackerEntrySchema>;
