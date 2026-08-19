import { z } from "zod";

export const signUpRequestSchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6).max(32),
});
