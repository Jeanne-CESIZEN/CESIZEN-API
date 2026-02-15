import { prisma } from "@/config/database";
import { BASE_EMOTION_SELECT } from "@/constants/prismaSelects";
import {
  BaseEmotionResponse,
  CreateBaseEmotionInput,
  UpdateBaseEmotionInput,
} from "@/schemas/baseEmotion";

export const createBaseEmotion = async (
  data: CreateBaseEmotionInput
): Promise<BaseEmotionResponse> => {
  const nameExists = await prisma.baseEmotion.findUnique({
    where: { name: data.name },
    select: { id: true },
  });

  if (nameExists) {
    throw new Error("BASE_EMOTION_NAME_ALREADY_EXISTS");
  }

  return await prisma.baseEmotion.create({
    data,
    select: BASE_EMOTION_SELECT,
  });
};

export const getAllBaseEmotions = async (): Promise<BaseEmotionResponse[]> => {
  return await prisma.baseEmotion.findMany({
    select: BASE_EMOTION_SELECT,
    orderBy: { name: "asc" },
  });
};

export const getBaseEmotionById = async (
  id: string
): Promise<BaseEmotionResponse> => {
  const baseEmotion = await prisma.baseEmotion.findUnique({
    where: { id },
    select: BASE_EMOTION_SELECT,
  });

  if (!baseEmotion) {
    throw new Error("BASE_EMOTION_NOT_FOUND");
  }

  return baseEmotion;
};

export const updateBaseEmotion = async (
  id: string,
  data: UpdateBaseEmotionInput
): Promise<BaseEmotionResponse> => {
  const existingBaseEmotion = await prisma.baseEmotion.findUnique({
    where: { id },
    select: BASE_EMOTION_SELECT,
  });

  if (!existingBaseEmotion) {
    throw new Error("BASE_EMOTION_NOT_FOUND");
  }

  if (data.name && data.name !== existingBaseEmotion.name) {
    const nameExists = await prisma.baseEmotion.findUnique({
      where: { name: data.name },
      select: { id: true },
    });

    if (nameExists) {
      throw new Error("BASE_EMOTION_NAME_ALREADY_EXISTS");
    }
  }

  return await prisma.baseEmotion.update({
    where: { id },
    data,
    select: BASE_EMOTION_SELECT,
  });
};

export const deleteBaseEmotion = async (id: string): Promise<void> => {
  const baseEmotion = await prisma.baseEmotion.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!baseEmotion) {
    throw new Error("BASE_EMOTION_NOT_FOUND");
  }

  await prisma.baseEmotion.delete({
    where: { id },
  });
};

export const searchBaseEmotions = async (
  query: string
): Promise<BaseEmotionResponse[]> => {
  if (!query || query.trim().length === 0) {
    return await prisma.baseEmotion.findMany({
      select: BASE_EMOTION_SELECT,
      orderBy: { name: "asc" },
    });
  }

  return await prisma.baseEmotion.findMany({
    where: {
      name: { contains: query.trim(), mode: "insensitive" },
    },
    select: BASE_EMOTION_SELECT,
    orderBy: { name: "asc" },
  });
};
