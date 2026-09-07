import { z } from "zod";

const email = z.string().trim().email().max(254);
const password = z.string().min(8).max(72);

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidExamDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    value >= formatLocalDate(new Date())
  );
}

export const signInSchema = z.object({
  email,
  password,
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2).max(120),
  username: z.string().trim().min(3).max(40),
  phone: z.string().trim().min(6).max(32),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(isValidExamDate),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;