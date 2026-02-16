import { prisma } from "@/config/database";
import { DETAILED_EMOTION_SELECT } from "@/constants/prismaSelects";
import {
  CreateDetailedEmotionInput,
  DetailedEmotionResponse,
  SearchDetailedEmotionQuery,
  UpdateDetailedEmotionInput,
} from "@/schemas/detailedEmotion";

export const createDetailedEmotion = async (
  data: CreateDetailedEmotionInput
): Promise<DetailedEmotionResponse> => {
  const baseEmotionExists = await prisma.baseEmotion.findUnique({
    where: { id: data.baseEmotionId },
    select: { id: true },
  });

  if (!baseEmotionExists) {
    throw new Error("BASE_EMOTION_NOT_FOUND");
  }

  const nameExistsInBase = await prisma.detailedEmotion.findFirst({
    where: { baseEmotionId: data.baseEmotionId, name: data.name },
    select: { id: true },
  });

  if (nameExistsInBase) {
    throw new Error("DETAILED_EMOTION_NAME_ALREADY_EXISTS_IN_BASE");
  }

  return await prisma.detailedEmotion.create({
    data,
    select: DETAILED_EMOTION_SELECT,
  });
};

export const getAllDetailedEmotions = async (): Promise<
  DetailedEmotionResponse[]
> => {
  return await prisma.detailedEmotion.findMany({
    select: DETAILED_EMOTION_SELECT,
    orderBy: { name: "asc" },
  });
};

export const getDetailedEmotionById = async (
  id: string
): Promise<DetailedEmotionResponse> => {
  const detailedEmotion = await prisma.detailedEmotion.findUnique({
    where: { id },
    select: DETAILED_EMOTION_SELECT,
  });

  if (!detailedEmotion) {
    throw new Error("DETAILED_EMOTION_NOT_FOUND");
  }

  return detailedEmotion;
};

export const updateDetailedEmotion = async (
  id: string,
  data: UpdateDetailedEmotionInput
): Promise<DetailedEmotionResponse> => {
  const existingDetailedEmotion = await prisma.detailedEmotion.findUnique({
    where: { id },
    select: DETAILED_EMOTION_SELECT,
  });

  if (!existingDetailedEmotion) {
    throw new Error("DETAILED_EMOTION_NOT_FOUND");
  }

  const targetBaseEmotionId =
    data.baseEmotionId ?? existingDetailedEmotion.baseEmotionId;
  const targetName = data.name ?? existingDetailedEmotion.name;

  if (data.baseEmotionId && data.baseEmotionId !== existingDetailedEmotion.baseEmotionId) {
    const baseEmotionExists = await prisma.baseEmotion.findUnique({
      where: { id: data.baseEmotionId },
      select: { id: true },
    });

    if (!baseEmotionExists) {
      throw new Error("BASE_EMOTION_NOT_FOUND");
    }
  }

  if (
    targetBaseEmotionId !== existingDetailedEmotion.baseEmotionId ||
    targetName !== existingDetailedEmotion.name
  ) {
    const nameExistsInBase = await prisma.detailedEmotion.findFirst({
      where: {
        baseEmotionId: targetBaseEmotionId,
        name: targetName,
        id: { not: id },
      },
      select: { id: true },
    });

    if (nameExistsInBase) {
      throw new Error("DETAILED_EMOTION_NAME_ALREADY_EXISTS_IN_BASE");
    }
  }

  return await prisma.detailedEmotion.update({
    where: { id },
    data,
    select: DETAILED_EMOTION_SELECT,
  });
};

export const deleteDetailedEmotion = async (id: string): Promise<void> => {
  const detailedEmotion = await prisma.detailedEmotion.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!detailedEmotion) {
    throw new Error("DETAILED_EMOTION_NOT_FOUND");
  }

  await prisma.detailedEmotion.delete({
    where: { id },
  });
};

export const searchDetailedEmotions = async (
  filters: SearchDetailedEmotionQuery
): Promise<DetailedEmotionResponse[]> => {
  if (!filters.q && filters.baseEmotionId === undefined) {
    return await prisma.detailedEmotion.findMany({
      select: DETAILED_EMOTION_SELECT,
      orderBy: { name: "asc" },
    });
  }

  const { q, baseEmotionId } = filters;

  return await prisma.detailedEmotion.findMany({
    where: {
      AND: [
        q ? { name: { contains: q, mode: "insensitive" } } : {},
        baseEmotionId !== undefined ? { baseEmotionId } : {},
      ],
    },
    select: DETAILED_EMOTION_SELECT,
    orderBy: { name: "asc" },
  });
};
