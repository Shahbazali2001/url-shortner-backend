import { z } from "zod";

export const signUpRequestSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

export const shortenRequestSchema = z.object({
  url: z.string().url(),
  code: z.string().optional(),
});
