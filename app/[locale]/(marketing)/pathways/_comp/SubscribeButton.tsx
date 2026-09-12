"use client";

import { useCallback, useContext } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { InterestDialogContext } from "@/components/marketing/InterestDialog";
import {
  academyQueryKeys,
  useCurrentUser,
  useSubscribeToCourse,
} from "../../_apiCalls/academyQueries";
import { useQueryClient } from "@tanstack/react-query";
import { type PathwayKey } from "./pathwayContent";

export default function SubscribeButton({
  children,
  pathway = "casc-academy",
  autoRedirect = true,
  onSuccess,
  className,
  showArrow = true,
}: {
  children: React.ReactNode;
  pathway?: PathwayKey;
  autoRedirect?: boolean;
  onSuccess?: () => void;
  className?: string;
  showArrow?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dialog = useContext(InterestDialogContext);
  const { data: user, isLoading } = useCurrentUser();
  const subscribe = useSubscribeToCourse();

  const completeSubscription = useCallback(async () => {
    try {
      const result = await subscribe.mutateAsync(pathway);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: academyQueryKeys.currentUser,
        }),
        queryClient.invalidateQueries({
          queryKey: academyQueryKeys.enrolledCourses,
        }),
      ]);

      if (onSuccess) {
        onSuccess();
      }

      if (autoRedirect) {
        router.push(
          `/${locale}/academy/courses/${pathway}/learn/${result.firstUnitSlug ?? "start-here"}`,
        );
      }
    } catch (err: unknown) {
      await queryClient.invalidateQueries({
        queryKey: academyQueryKeys.enrolledCourses,
      });

      const message =
        err instanceof Error ? err.message : String(err ?? "");
      const isAlreadySubscribed =
        message.includes("already_subscribed") ||
        (typeof err === "object" &&
          err !== null &&
          "status" in err &&
          (err as { status: number }).status === 409);

      if (isAlreadySubscribed) {
        if (onSuccess) {
          onSuccess();
        }
        if (autoRedirect) {
          router.push(`/${locale}/academy/courses/${pathway}/learn/start-here`);
        }
        return;
      }

      console.error("[SubscribeButton] Subscription error:", err);
    }
  }, [
    autoRedirect,
    locale,
    onSuccess,
    pathway,
    queryClient,
    router,
    subscribe,
  ]);

  function handleClick() {
    if (!user) {
      dialog?.openInterestDialog(pathway, "register", completeSubscription);
      return;
    }
    completeSubscription();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || subscribe.isPending}
      className={
        className ||
        "btn btn-gold !rounded-full !min-h-12 !px-7 font-body text-sm font-semibold text-navy inline-flex items-center justify-center transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {subscribe.isPending ? "…" : children}
      {showArrow && (
        <span className="ms-3" aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
