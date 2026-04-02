import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
