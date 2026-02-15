import { z } from "zod";
import { Role } from "@/generated/prisma";

export const zUser = z.object({
  id: z.string().cuid("ID must be a valid CUID"),
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastname: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z.email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(Role).default(Role.USER),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = zUser.pick({
  firstname: true,
  lastname: true,
  email: true,
  password: true,
  role: true,
});

export const updateUserSchema = zUser
  .pick({
    firstname: true,
    lastname: true,
    email: true,
    password: true,
    role: true,
    isActive: true,
  })
  .partial();

export const userIdSchema = z.object({
  id: z.string().cuid("ID must be a valid CUID"),
});

export const searchUserSchema = z.object({
  q: z.string().min(1, "Search query must not be empty").optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export type UserResponse = Omit<z.infer<typeof zUser>, "password">;
export type UserWithPassword = z.infer<typeof zUser>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdSchema>;
export type SearchUserQuery = z.infer<typeof searchUserSchema>;
