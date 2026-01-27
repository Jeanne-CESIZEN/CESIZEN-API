import { z } from "zod";
import { Role } from "@/generated/prisma";

// ✅ Schéma de création d'utilisateur
export const createUserSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim()
    .optional(),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .trim()
    .optional(),
  email: z.email("Invalid email format").toLowerCase().trim().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum([Role.USER, Role.ADMIN]).optional(),
});

// ✅ Schéma de mise à jour d'utilisateur
export const updateUserSchema = z
  .object({
    firstname: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .trim()
      .optional(),
    lastname: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .trim()
      .optional(),
    email: z.email("Invalid email format").toLowerCase().trim().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    role: z.enum([Role.USER, Role.ADMIN]).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// ✅ Schéma de validation d'ID
export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform(Number)
    .refine((val) => val > 0, "ID must be greater than 0"),
});

// ✅ Schéma de recherche
export const searchUserSchema = z.object({
  q: z.string().min(1, "Search query must be at least 1 character").optional(),
  role: z.enum([Role.USER, Role.ADMIN]).optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

// ✅ Inférence des types depuis Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
export type SearchUserQuery = z.infer<typeof searchUserSchema>;

// ✅ Type pour la réponse utilisateur (sans password)
export type UserResponse = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ✅ Type pour les statistiques
export type UserStatsResponse = {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<Role, number>;
};
