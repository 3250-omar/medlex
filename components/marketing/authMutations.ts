"use client";

import { useMutation } from "@tanstack/react-query";
import type { SignInInput, SignUpInput } from "@/lib/auth/validation";
import { apiRequest } from "@/lib/api/client";

type AuthResponse = {
  userId: string;
  requiresEmailConfirmation?: boolean;
};

async function postAuth<TInput>(
  url: string,
  input: TInput,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: (input: SignInInput) => postAuth("/api/auth/sign-in", input),
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (input: SignUpInput) => postAuth("/api/auth/sign-up", input),
  });
}
