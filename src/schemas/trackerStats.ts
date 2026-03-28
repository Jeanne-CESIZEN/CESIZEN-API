import { z } from "zod";
import { zUser } from "./user";

export const TRACKER_STATS_ALLOWED_PERIODS = [7, 30, 90] as const;
export type TrackerStatsPeriod = (typeof TRACKER_STATS_ALLOWED_PERIODS)[number];

export const DEFAULT_TRACKER_STATS_PERIOD: TrackerStatsPeriod =
  TRACKER_STATS_ALLOWED_PERIODS[0];

const isTrackerStatsPeriod = (value: number): value is TrackerStatsPeriod => {
  return TRACKER_STATS_ALLOWED_PERIODS.includes(value as TrackerStatsPeriod);
};

export const trackerStatsQuerySchema = z.object({
  period: z
    .coerce.number()
    .int("Period must be an integer")
    .refine(isTrackerStatsPeriod, {
      message: "Period must be 7, 30, or 90",
    })
    .optional(),
  userId: zUser.shape.id.optional(),
});

export const trackerStatsEmotionSchema = z.object({
  key: z.string(),
  name: z.string(),
  emoji: z.string(),
  color: z.string(),
});

export const trackerStatsDominantEmotionSchema = z.object({
  key: z.string(),
  name: z.string(),
  emoji: z.string(),
  color: z.string(),
  count: z.number().int().nonnegative(),
});

export const trackerStatsAverageMoodSchema = z.object({
  score: z.number().nonnegative(),
  count: z.number().int().nonnegative(),
});

export const trackerStatsStreakSchema = z.object({
  days: z.number().int().nonnegative(),
});

export const trackerStatsDistributionItemSchema = z.object({
  key: z.string(),
  count: z.number().int().nonnegative(),
  percent: z.number().int().nonnegative(),
});

export const trackerStatsTimelineCountsSchema = z.record(
  z.string(),
  z.number().int().nonnegative()
);

export const trackerStatsTimelinePointSchema = z.object({
  date: z.string(),
  label: z.string(),
  total: z.number().int().nonnegative(),
  averageMood: z.number().nonnegative(),
  counts: trackerStatsTimelineCountsSchema,
});

export const trackerStatsSummarySchema = z.object({
  dominantEmotion: trackerStatsDominantEmotionSchema.nullable(),
  averageMood: trackerStatsAverageMoodSchema,
  streak: trackerStatsStreakSchema,
});

export const trackerStatsResponseSchema = z.object({
  period: z.number().int().positive(),
  summary: trackerStatsSummarySchema,
  emotions: z.array(trackerStatsEmotionSchema),
  distribution: z.array(trackerStatsDistributionItemSchema),
  timeline: z.array(trackerStatsTimelinePointSchema),
});

export const trackerStatsEmotionDefinitionSchema = z.object({
  key: z.string(),
  name: z.string(),
  emoji: z.string().nullable(),
  color: z.string().nullable(),
  score: z.number(),
});

export const trackerStatsEmotionLookupSchema = z.record(
  z.string(),
  trackerStatsEmotionDefinitionSchema
);

export const trackerStatsEmotionCatalogSchema = z.object({
  byName: trackerStatsEmotionLookupSchema,
  byKey: trackerStatsEmotionLookupSchema,
  emotions: z.array(trackerStatsEmotionSchema),
});

export const trackerStatsEmotionCountSchema = z.object({
  count: z.number().int().nonnegative(),
});

export const trackerStatsEmotionCountMapSchema = z.record(
  z.string(),
  trackerStatsEmotionCountSchema
);

export const trackerStatsDailyAccumulatorSchema = z.object({
  date: z.string(),
  label: z.string(),
  total: z.number().int().nonnegative(),
  counts: trackerStatsTimelineCountsSchema,
  scoreSum: z.number().nonnegative(),
});

export type TrackerStatsQuery = z.infer<typeof trackerStatsQuerySchema>;
export type TrackerStatsResponse = z.infer<typeof trackerStatsResponseSchema>;
export type TrackerStatsStreak = z.infer<typeof trackerStatsStreakSchema>;
export type TrackerStatsDailyAccumulator = z.infer<
  typeof trackerStatsDailyAccumulatorSchema
>;
export type TrackerStatsEmotionCatalog = z.infer<
  typeof trackerStatsEmotionCatalogSchema
>;
export type TrackerStatsEmotionCountMap = z.infer<
  typeof trackerStatsEmotionCountMapSchema
>;
