import { z } from "zod";

const email = z.string().trim().email().max(254);
const password = z.string().min(8).max(72);

export const signInSchema = z.object({
  email,
  password,
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2).max(120),
  username: z.string().trim().min(3).max(40),
  phone: z.string().trim().min(6).max(32),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;