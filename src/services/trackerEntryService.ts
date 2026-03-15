import { prisma } from "@/config/database";
import { TRACKER_ENTRY_SELECT } from "@/constants/prismaSelects";
import {
  CreateTrackerEntryInput,
  SearchTrackerEntryQuery,
  TrackerEntryResponse,
  UpdateTrackerEntryInput,
} from "@/schemas/trackerEntry";

const ensureUserExists = async (userId: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
};

const ensureDetailedEmotionExists = async (
  detailedEmotionId: string
): Promise<void> => {
  const detailedEmotion = await prisma.detailedEmotion.findUnique({
    where: { id: detailedEmotionId },
    select: { id: true },
  });

  if (!detailedEmotion) {
    throw new Error("DETAILED_EMOTION_NOT_FOUND");
  }
};

export const createTrackerEntry = async (
  data: CreateTrackerEntryInput
): Promise<TrackerEntryResponse> => {
  await ensureUserExists(data.userId);
  await ensureDetailedEmotionExists(data.detailedEmotionId);

  return await prisma.trackerEntry.create({
    data,
    select: TRACKER_ENTRY_SELECT,
  });
};

export const getAllTrackerEntries = async (): Promise<
  TrackerEntryResponse[]
> => {
  return await prisma.trackerEntry.findMany({
    select: TRACKER_ENTRY_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const getTrackerEntriesByUser = async (
  userId: string
): Promise<TrackerEntryResponse[]> => {
  await ensureUserExists(userId);

  return await prisma.trackerEntry.findMany({
    where: { userId },
    select: TRACKER_ENTRY_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export const getTrackerEntryById = async (
  id: string
): Promise<TrackerEntryResponse> => {
  const trackerEntry = await prisma.trackerEntry.findUnique({
    where: { id },
    select: TRACKER_ENTRY_SELECT,
  });

  if (!trackerEntry) {
    throw new Error("TRACKER_ENTRY_NOT_FOUND");
  }

  return trackerEntry;
};

export const updateTrackerEntry = async (
  id: string,
  data: UpdateTrackerEntryInput
): Promise<TrackerEntryResponse> => {
  const existingTrackerEntry = await prisma.trackerEntry.findUnique({
    where: { id },
    select: TRACKER_ENTRY_SELECT,
  });

  if (!existingTrackerEntry) {
    throw new Error("TRACKER_ENTRY_NOT_FOUND");
  }

  if (data.userId && data.userId !== existingTrackerEntry.userId) {
    await ensureUserExists(data.userId);
  }

  if (
    data.detailedEmotionId &&
    data.detailedEmotionId !== existingTrackerEntry.detailedEmotionId
  ) {
    await ensureDetailedEmotionExists(data.detailedEmotionId);
  }

  return await prisma.trackerEntry.update({
    where: { id },
    data,
    select: TRACKER_ENTRY_SELECT,
  });
};

export const deleteTrackerEntry = async (id: string): Promise<void> => {
  const trackerEntry = await prisma.trackerEntry.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!trackerEntry) {
    throw new Error("TRACKER_ENTRY_NOT_FOUND");
  }

  await prisma.trackerEntry.delete({
    where: { id },
  });
};

export const searchTrackerEntries = async (
  filters: SearchTrackerEntryQuery
): Promise<TrackerEntryResponse[]> => {
  if (
    !filters.q &&
    filters.userId === undefined &&
    filters.detailedEmotionId === undefined
  ) {
    return await prisma.trackerEntry.findMany({
      select: TRACKER_ENTRY_SELECT,
      orderBy: { createdAt: "desc" },
    });
  }

  const { q, userId, detailedEmotionId } = filters;

  return await prisma.trackerEntry.findMany({
    where: {
      AND: [
        q ? { comment: { contains: q, mode: "insensitive" } } : {},
        userId !== undefined ? { userId } : {},
        detailedEmotionId !== undefined ? { detailedEmotionId } : {},
      ],
    },
    select: TRACKER_ENTRY_SELECT,
    orderBy: { createdAt: "desc" },
  });
};

export { getTrackerStats } from "./trackerStatsService";
