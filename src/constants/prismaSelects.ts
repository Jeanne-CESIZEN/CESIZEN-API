import { Prisma } from "@/generated/prisma";

/**
 * Standard user select that excludes password field
 * Used for all public user responses
 */
export const USER_SELECT: Prisma.UserSelect = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * User select including password field
 * Only used for authentication purposes
 */
export const USER_WITH_PASSWORD_SELECT: Prisma.UserSelect = {
  ...USER_SELECT,
  password: true,
};

/**
 * Standard category select
 * Returns all category fields
 */
export const CATEGORY_SELECT: Prisma.CategorySelect = {
  id: true,
  name: true,
  color: true,
  iconName: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Standard article select
 * Returns all article fields
 */
export const ARTICLE_SELECT: Prisma.ArticleSelect = {
  id: true,
  categoryId: true,
  title: true,
  description: true,
  content: true,
  imagePath: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Standard base emotion select
 * Returns all base emotion fields
 */
export const BASE_EMOTION_SELECT: Prisma.BaseEmotionSelect = {
  id: true,
  name: true,
  emoji: true,
  color: true,
  score: true,
  order: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Standard detailed emotion select
 * Returns all detailed emotion fields
 */
export const DETAILED_EMOTION_SELECT: Prisma.DetailedEmotionSelect = {
  id: true,
  baseEmotionId: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Standard tracker entry select
 * Returns all tracker entry fields
 */
export const TRACKER_ENTRY_SELECT: Prisma.TrackerEntrySelect = {
  id: true,
  userId: true,
  detailedEmotionId: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
};
