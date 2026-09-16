"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type {
  SessionContextData,
  SlotDTO,
  PurchaseStatusData,
  CheckoutResultData,
  BookingDTO,
} from "@/lib/private-sessions/types";
import type {
  DirectCheckoutInput,
  PackageCheckoutInput,
  BookingRedemptionInput,
} from "@/lib/private-sessions/schemas";
import { academyQueryKeys } from "../../_apiCalls/academyQueries";

export const privateSessionKeys = {
  all: ["private-sessions"] as const,
  context: (courseSlug: string) =>
    [...privateSessionKeys.all, "context", courseSlug] as const,
  availability: (courseSlug: string, from: string, to: string) =>
    [...privateSessionKeys.all, "availability", courseSlug, from, to] as const,
  purchase: (purchaseId: string) =>
    [...privateSessionKeys.all, "purchase", purchaseId] as const,
};

export function usePrivateSessionContext(courseSlug = "casc-academy") {
  return useQuery({
    queryKey: privateSessionKeys.context(courseSlug),
    queryFn: async () => {
      const res = await apiRequest<SessionContextData>(
        `/api/private-sessions/context?courseSlug=${courseSlug}`,
      );
      return res;
    },
    staleTime: 30_000,
  });
}

export function useSlotAvailability({
  courseSlug = "casc-academy",
  from,
  to,
  enabled = true,
}: {
  courseSlug?: string;
  from: string;
  to: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: privateSessionKeys.availability(courseSlug, from, to),
    queryFn: async () => {
      const slots = await apiRequest<SlotDTO[]>(
        `/api/private-sessions/availability?courseSlug=${courseSlug}&from=${from}&to=${to}`,
      );
      // apiRequest already unwraps body.data — return directly, never undefined
      return slots ?? [];
    },
    enabled: enabled && Boolean(from && to),
    staleTime: 15_000,
    gcTime: 60_000,
  });
}

export function usePurchaseStatus(purchaseId: string | null, enabled = false) {
  return useQuery({
    queryKey: privateSessionKeys.purchase(purchaseId || ""),
    queryFn: async () => {
      if (!purchaseId) throw new Error("Missing purchase ID");
      // apiRequest already unwraps body.data — result is PurchaseStatusData directly
      const status = await apiRequest<PurchaseStatusData>(
        `/api/private-sessions/purchases/${purchaseId}`,
      );
      if (status === undefined)
        throw new Error("Empty purchase status response");
      return status;
    },
    enabled: enabled && Boolean(purchaseId),
    refetchInterval: (query) => {
      const data = query.state.data;
      const status = data?.status;
      const booking = data?.booking;

      // If paid direct booking, keep polling until meeting link and email status are ready
      if (status === "paid") {
        const needsMeeting =
          booking && !booking.sessionLink && booking.meetingStatus !== "failed";
        const needsEmail =
          booking &&
          booking.emailStatus !== "sent" &&
          booking.emailStatus !== "failed";

        if (needsMeeting || needsEmail) {
          return 2000;
        }
        return false;
      }

      // Stop polling on terminal states
      if (
        status === "failed" ||
        status === "cancelled" ||
        status === "paid_unfulfilled"
      ) {
        return false;
      }
      return 2500; // Poll every 2.5s while pending
    },
  });
}

export function useDirectCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      idempotencyKey,
    }: {
      input: DirectCheckoutInput;
      idempotencyKey: string;
    }) => {
      const res = await fetch("/api/private-sessions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to initiate checkout");
      }
      return json.data as CheckoutResultData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privateSessionKeys.all });
      queryClient.refetchQueries({ queryKey: privateSessionKeys.all });
      queryClient.invalidateQueries({ queryKey: academyQueryKeys.currentUser });
      queryClient.refetchQueries({ queryKey: academyQueryKeys.currentUser });
    },
  });
}

export function usePackageCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      idempotencyKey,
    }: {
      input: PackageCheckoutInput;
      idempotencyKey: string;
    }) => {
      const res = await fetch("/api/private-sessions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error?.message || "Failed to initiate package checkout",
        );
      }
      return json.data as CheckoutResultData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privateSessionKeys.all });
      queryClient.refetchQueries({ queryKey: privateSessionKeys.all });
      queryClient.invalidateQueries({ queryKey: academyQueryKeys.currentUser });
      queryClient.refetchQueries({ queryKey: academyQueryKeys.currentUser });
    },
  });
}

export function useRedeemCreditMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      idempotencyKey,
    }: {
      input: BookingRedemptionInput;
      idempotencyKey: string;
    }) => {
      const res = await fetch("/api/private-sessions/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error?.message || "Failed to redeem session credit",
        );
      }
      return json.data as BookingDTO;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privateSessionKeys.all });
      queryClient.refetchQueries({ queryKey: privateSessionKeys.all });
      queryClient.invalidateQueries({ queryKey: academyQueryKeys.currentUser });
      queryClient.refetchQueries({ queryKey: academyQueryKeys.currentUser });
    },
  });
}
