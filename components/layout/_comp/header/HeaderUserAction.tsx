"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import {
  academyQueryKeys,
  useCurrentUser,
} from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import { apiRequest } from "@/lib/api/client";
import { showApiError } from "@/lib/api/errorToast";
import UserAccountMenu from "./UserAccountMenu";

interface HeaderUserActionProps {
  buttonClassName?: string;
}

export function HeaderUserAction({
  buttonClassName = "btn btn-gold !h-9 !py-1 !px-5 text-sm font-semibold",
}: HeaderUserActionProps) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const isProtectedPath = useCallback((path: string) => {
    const cleanPath = path.replace(/^\/(en|ar)/, "");
    if (cleanPath.startsWith("/academy/preview")) return false;
    return (
      cleanPath.startsWith("/courses") ||
      cleanPath.startsWith("/academy") ||
      cleanPath.startsWith("/profile")
    );
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await apiRequest<{ signedOut: boolean }>("/api/auth/sign-out", {
        method: "POST",
      });
    } catch (error) {
      showApiError(error);
      return;
    }

    queryClient.setQueryData(academyQueryKeys.currentUser, null);
    queryClient.removeQueries({ queryKey: academyQueryKeys.authenticated });
    await queryClient.invalidateQueries({
      queryKey: academyQueryKeys.currentUser,
    });

    if (isProtectedPath(pathname)) {
      router.push(`/${locale}`);
      router.refresh();
    }
  }, [queryClient, pathname, locale, router, isProtectedPath]);

  // Prevent SSR / Client hydration mismatch for client-only authenticated user state
  if (mounted && user) {
    return (
      <UserAccountMenu
        user={user}
        locale={locale}
        onSignOut={handleSignOut}
        profileLabel={t("nav.profile")}
        logoutLabel={t("actions.logout")}
      />
    );
  }

  return (
    <InterestDialogTrigger className={buttonClassName}>
      {t("actions.register")}
    </InterestDialogTrigger>
  );
}

export default HeaderUserAction;
