import { z } from "zod";

export const signInSchema = z.object({
  Identifier: z.string().min(1, "Identifier is required"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .max(100, "Password must be at most 100 characters long"),
});
