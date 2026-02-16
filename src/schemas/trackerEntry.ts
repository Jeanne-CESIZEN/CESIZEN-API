import { z } from "zod";

export const zTrackerEntry = z.object({
  id: z.string().cuid("ID must be a valid CUID"),
  userId: z.string().cuid("User ID must be a valid CUID"),
  detailedEmotionId: z
    .string()
    .cuid("Detailed emotion ID must be a valid CUID"),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters").optional(),
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

export const trackerEntryIdSchema = z.object({
  id: z.string().cuid("ID must be a valid CUID"),
});

export const trackerEntryUserIdSchema = z.object({
  userId: z.string().cuid("User ID must be a valid CUID"),
});

export const searchTrackerEntrySchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
  userId: z.string().cuid("User ID must be a valid CUID").optional(),
  detailedEmotionId: z
    .string()
    .cuid("Detailed emotion ID must be a valid CUID")
    .optional(),
});

export type TrackerEntryResponse = z.infer<typeof zTrackerEntry>;
export type CreateTrackerEntryInput = z.infer<typeof createTrackerEntrySchema>;
export type UpdateTrackerEntryInput = z.infer<typeof updateTrackerEntrySchema>;
export type TrackerEntryIdParam = z.infer<typeof trackerEntryIdSchema>;
export type TrackerEntryUserIdParam = z.infer<typeof trackerEntryUserIdSchema>;
export type SearchTrackerEntryQuery = z.infer<typeof searchTrackerEntrySchema>;
