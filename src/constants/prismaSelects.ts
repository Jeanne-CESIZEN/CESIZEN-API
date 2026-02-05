import { Prisma } from "@/generated/prisma/client";

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
  description: true,
  createdAt: true,
  updatedAt: true,
};
