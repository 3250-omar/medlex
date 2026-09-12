"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  ResetPasswordInput,
  SendOtpInput,
  SignInInput,
} from "@/lib/auth/validation";
import { apiRequest } from "@/lib/api/client";

type AuthResponse = {
  userId: string;
  requiresEmailConfirmation?: boolean;
};

type ResetPasswordResponse = {
  success: boolean;
  email?: string;
};

export type SendOtpResponse = {
  success: boolean;
  email: string;
  phone?: string;
  code?: string;
  emailSent?: boolean;
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
    mutationFn: (input: FormData) =>
      apiRequest<AuthResponse>("/api/auth/sign-up", {
        method: "POST",
        body: input,
      }),
  });
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: (input: SendOtpInput) =>
      apiRequest<SendOtpResponse>("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
  });
}

export function useSendWhatsAppOtpMutation() {
  return useSendOtpMutation();
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      apiRequest<ResetPasswordResponse>("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
  });
}
