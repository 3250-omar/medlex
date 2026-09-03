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

export default function SubscribeButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dialog = useContext(InterestDialogContext);
  const { data: user, isLoading } = useCurrentUser();
  const subscribe = useSubscribeToCourse();

  const completeSubscription = useCallback(async () => {
    const result = await subscribe.mutateAsync("casc-academy");
    await queryClient.invalidateQueries({
      queryKey: academyQueryKeys.currentUser,
    });
    router.push(
      `/${locale}/academy/courses/casc-academy/learn/${result.firstUnitSlug ?? "start-here"}`,
    );
  }, [locale, queryClient, router, subscribe]);

  function handleClick() {
    if (!user) {
      dialog?.openInterestDialog(
        "casc-academy",
        "register",
        completeSubscription,
      );
      return;
    }
    router.push(`/${locale}/courses`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || subscribe.isPending}
      className="inline-flex min-h-12 items-center justify-center bg-signal px-6 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-60"
    >
      {subscribe.isPending ? "…" : user ? "Go to your courses" : children}
      <span className="ms-3" aria-hidden="true">
        →
      </span>
    </button>
  );
}
