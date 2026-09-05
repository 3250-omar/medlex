"use client";

import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { showApiError } from "@/lib/api/errorToast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import SpotlightCard from "@/components/SpotlightCard";
import {
  academyQueryKeys,
  useCurrentUser,
  useEnrolledCourses,
} from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

import ProfileSkeleton from "./_comp/ProfileSkeleton";
import ProfileGuestState from "./_comp/ProfileGuestState";
import ProfileHeader from "./_comp/ProfileHeader";
import ProfileStats from "./_comp/ProfileStats";
import ProfileDetails from "./_comp/ProfileDetails";
import ProfileCourses from "./_comp/ProfileCourses";
import ProfileSidebar from "./_comp/ProfileSidebar";

export default function ProfilePage() {
  const locale = useLocale();
  const t = useTranslations("profile");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const { data: courses, isLoading: isLoadingCourses } = useEnrolledCourses(
    Boolean(user),
  );

  async function handleSignOut() {
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
    router.push(`/${locale}`);
  }

  if (isLoadingUser) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return <ProfileGuestState locale={locale} />;
  }

  const enrolledCount = courses?.length ?? 0;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink pb-24 pt-28 text-white sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 border-b border-white/5 bg-white/[0.015]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <nav
          aria-label={t("breadcrumb.profile")}
          className="flex items-center gap-2 font-body text-xs text-white/45"
        >
          <Link
            href={`/${locale}`}
            className="rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
          >
            {t("breadcrumb.home")}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-signal">
            {t("breadcrumb.profile")}
          </span>
        </nav>

        <SpotlightCard className="mt-6 rounded-2xl">
          <ProfileHeader user={user} locale={locale} onSignOut={handleSignOut} />
        </SpotlightCard>

        <SpotlightCard className="mt-5 rounded-2xl">
          <ProfileStats enrolledCount={enrolledCount} locale={locale} />
        </SpotlightCard>

        <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <SpotlightCard className="rounded-2xl">
              <ProfileDetails user={user} locale={locale} />
            </SpotlightCard>

            <SpotlightCard className="rounded-2xl">
              <ProfileCourses
                courses={courses}
                isLoading={isLoadingCourses}
                locale={locale}
              />
            </SpotlightCard>
          </div>

          <aside aria-label={t("breadcrumb.profile")} className="lg:pt-0.5">
            <SpotlightCard className="rounded-2xl">
              <ProfileSidebar locale={locale} />
            </SpotlightCard>
          </aside>
        </div>
      </div>
    </main>
  );
}
