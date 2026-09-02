"use client";

import { useMutation } from "@tanstack/react-query";
import type { SignInInput, SignUpInput } from "@/lib/auth/validation";

type AuthResponse = {
  userId: string;
  requiresEmailConfirmation?: boolean;
};

async function postAuth<TInput>(
  url: string,
  input: TInput,
): Promise<AuthResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json().catch(() => null)) as {
    data?: AuthResponse;
    error?: string;
  } | null;

  if (!response.ok || !body?.data) {
    throw new Error(body?.error ?? "Unable to complete authentication.");
  }

  return body.data;
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
