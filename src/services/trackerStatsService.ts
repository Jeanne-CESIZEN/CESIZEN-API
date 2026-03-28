import dayjs from "dayjs";
import "dayjs/locale/fr";

import { prisma } from "@/config/database";
import {
  trackerStatsResponseSchema,
  TrackerStatsDailyAccumulator,
  TrackerStatsEmotionCatalog,
  TrackerStatsEmotionCountMap,
  TrackerStatsResponse,
} from "@/schemas/trackerStats";

dayjs.locale("fr");

const getStartOfDay = (date: Date) => dayjs(date).startOf("day").toDate();
const shiftDateByDays = (date: Date, days: number) =>
  dayjs(date).add(days, "day").toDate();
const formatDateKey = (date: Date) => dayjs(date).format("YYYY-MM-DD");
const formatDateLabel = (date: Date) => dayjs(date).format("DD MMM");

const computeAverageScore = (scoreSum: number, entryCount: number) =>
  entryCount > 0 ? scoreSum / entryCount : 0;

const toEmotionKey = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const toUniqueEmotionKey = (
  name: string,
  keyUsageCount: Record<string, number>
) => {
  const baseKey = toEmotionKey(name) || "emotion";
  const usageCount = keyUsageCount[baseKey] ?? 0;
  keyUsageCount[baseKey] = usageCount + 1;

  if (usageCount === 0) {
    return baseKey;
  }

  return `${baseKey}_${usageCount + 1}`;
};

const fetchBaseEmotions = async () => {
  return await prisma.baseEmotion.findMany({
    select: { name: true, emoji: true, color: true, score: true, order: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
};

const fetchCurrentPeriodEntries = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  return await prisma.trackerEntry.findMany({
    where: { userId, createdAt: { gte: startDate, lt: endDate } },
    select: {
      createdAt: true,
      detailedEmotion: { select: { baseEmotion: { select: { name: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });
};

const fetchAllEntryDates = async (userId: string) => {
  return await prisma.trackerEntry.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });
};

const buildEmotionCatalog = (
  baseEmotions: Awaited<ReturnType<typeof fetchBaseEmotions>>
): TrackerStatsEmotionCatalog => {
  const emotionByName: TrackerStatsEmotionCatalog["byName"] = {};
  const emotionByKey: TrackerStatsEmotionCatalog["byKey"] = {};
  const keyUsageCount: Record<string, number> = {};

  const emotions = baseEmotions.map((baseEmotion) => {
    const key = toUniqueEmotionKey(baseEmotion.name, keyUsageCount);

    emotionByName[baseEmotion.name] = {
      key,
      name: baseEmotion.name,
      emoji: baseEmotion.emoji,
      color: baseEmotion.color,
      score: baseEmotion.score,
    };
    emotionByKey[key] = emotionByName[baseEmotion.name];

    return {
      key,
      name: baseEmotion.name,
      emoji: baseEmotion.emoji ?? "",
      color: baseEmotion.color ?? "",
    };
  });

  return {
    byName: emotionByName,
    byKey: emotionByKey,
    emotions,
  };
};

const buildDailyAccumulators = (startDate: Date, dayCount: number) => {
  const dailyAccumulators: TrackerStatsDailyAccumulator[] = Array.from(
    { length: dayCount },
    (_, dayOffset) => {
      const date = shiftDateByDays(startDate, dayOffset);
      return {
        date: formatDateKey(date),
        label: formatDateLabel(date),
        total: 0,
        counts: {},
        scoreSum: 0,
      };
    }
  );

  const dailyIndexByDate = new Map(
    dailyAccumulators.map((bucket, index) => [bucket.date, index])
  );

  return { dailyAccumulators, dailyIndexByDate };
};

const getDominantEmotion = (
  emotionCounts: TrackerStatsEmotionCountMap,
  emotionCatalog: TrackerStatsEmotionCatalog
): TrackerStatsResponse["summary"]["dominantEmotion"] => {
  const sortedEmotions = Object.entries(emotionCounts).sort(
    (left, right) => right[1].count - left[1].count
  );
  const topEmotion = sortedEmotions[0];

  if (!topEmotion) {
    return null;
  }

  const emotion = emotionCatalog.byKey[topEmotion[0]];
  if (!emotion) {
    return null;
  }

  return {
    key: topEmotion[0],
    name: emotion.name,
    emoji: emotion.emoji ?? "",
    color: emotion.color ?? "",
    count: topEmotion[1].count,
  };
};

const buildDistribution = (
  emotionCounts: TrackerStatsEmotionCountMap,
  totalEntries: number
): TrackerStatsResponse["distribution"] => {
  return Object.entries(emotionCounts)
    .map(([key, emotionCount]) => ({
      key,
      count: emotionCount.count,
      percent:
        totalEntries > 0
          ? Math.round((emotionCount.count / totalEntries) * 100)
          : 0,
    }))
    .sort((left, right) => right.count - left.count);
};

const getTotalEntryCount = (emotionCounts: TrackerStatsEmotionCountMap) => {
  return Object.values(emotionCounts).reduce(
    (total, emotionCount) => total + emotionCount.count,
    0
  );
};

const computeStreak = (
  allEntries: Awaited<ReturnType<typeof fetchAllEntryDates>>
): number => {
  const entryDateSet = new Set(
    allEntries.map((entry) => formatDateKey(entry.createdAt))
  );

  let streak = 0;
  let current = dayjs().startOf("day");

  while (entryDateSet.has(current.format("YYYY-MM-DD"))) {
    streak++;
    current = current.subtract(1, "day");
  }

  return streak;
};

export const getTrackerStats = async (
  userId: string,
  periodDays: number
): Promise<TrackerStatsResponse> => {
  const today = getStartOfDay(new Date());
  const currentPeriodStart = shiftDateByDays(today, -(periodDays - 1));
  const currentPeriodEnd = shiftDateByDays(today, 1);

  const [baseEmotions, currentPeriodEntries, allEntryDates] =
    await Promise.all([
      fetchBaseEmotions(),
      fetchCurrentPeriodEntries(userId, currentPeriodStart, currentPeriodEnd),
      fetchAllEntryDates(userId),
    ]);

  const emotionCatalog = buildEmotionCatalog(baseEmotions);
  const emotionCounts: TrackerStatsEmotionCountMap = {};
  let currentPeriodScoreSum = 0;

  const { dailyAccumulators, dailyIndexByDate } = buildDailyAccumulators(
    currentPeriodStart,
    periodDays
  );

  for (const entry of currentPeriodEntries) {
    const baseEmotionName = entry.detailedEmotion.baseEmotion.name;
    const emotion = emotionCatalog.byName[baseEmotionName];

    if (!emotion) {
      continue;
    }

    currentPeriodScoreSum += emotion.score;

    const emotionKey = emotion.key;
    const emotionCounter =
      emotionCounts[emotionKey] ??
      (emotionCounts[emotionKey] = {
        count: 0,
      });
    emotionCounter.count += 1;

    const dateKey = formatDateKey(entry.createdAt);
    const dayIndex = dailyIndexByDate.get(dateKey);

    if (dayIndex === undefined) {
      continue;
    }

    const dayBucket = dailyAccumulators[dayIndex];
    dayBucket.total += 1;
    dayBucket.counts[emotionKey] = (dayBucket.counts[emotionKey] ?? 0) + 1;
    dayBucket.scoreSum += emotion.score;
  }

  const totalEntries = getTotalEntryCount(emotionCounts);
  const currentAverageScore = computeAverageScore(
    currentPeriodScoreSum,
    totalEntries
  );

  const timeline = dailyAccumulators.map((dailyAccumulator) => ({
    date: dailyAccumulator.date,
    label: dailyAccumulator.label,
    total: dailyAccumulator.total,
    averageMood: computeAverageScore(
      dailyAccumulator.scoreSum,
      dailyAccumulator.total
    ),
    counts: dailyAccumulator.counts,
  }));

  const trackerStats: TrackerStatsResponse = {
    period: periodDays,
    summary: {
      dominantEmotion: getDominantEmotion(emotionCounts, emotionCatalog),
      averageMood: {
        score: currentAverageScore,
        count: totalEntries,
      },
      streak: { days: computeStreak(allEntryDates) },
    },
    emotions: emotionCatalog.emotions,
    distribution: buildDistribution(emotionCounts, totalEntries),
    timeline,
  };

  return trackerStatsResponseSchema.parse(trackerStats);
};
