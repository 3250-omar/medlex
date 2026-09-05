"use client";

import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { showApiError } from "@/lib/api/errorToast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
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
    });    router.push(`/${locale}`);
  }

  // ── Loading Skeleton ────────────────────────────────────────────────────────
  if (isLoadingUser) {
    return <ProfileSkeleton />;
  }

  // ── Guest State (Not Logged In) ─────────────────────────────────────────────
  if (!user) {
    return <ProfileGuestState locale={locale} />;
  }

  // ── Authenticated Profile View ──────────────────────────────────────────────
  const enrolledCount = courses?.length ?? 0;

  return (
    <main className="min-h-screen bg-ink pb-24 pt-28 text-white sm:pt-36">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10">
        {/* Breadcrumb / Label */}
        <div className="flex items-center gap-2 font-body text-xs text-white/40">
          <Link href={`/${locale}`} className="hover:text-white">
            {t("breadcrumb.home")}
          </Link>
          <span>/</span>
          <span className="text-signal">
            {t("breadcrumb.profile")}
          </span>
        </div>

        {/* Hero Identity Banner */}
        <ProfileHeader user={user} locale={locale} onSignOut={handleSignOut} />

        {/* Quick Stats Grid */}
        <ProfileStats enrolledCount={enrolledCount} locale={locale} />

        {/* Main Content: Two Columns */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left / Main Column (Personal Information & Enrolled Courses) */}
          <div className="space-y-8 lg:col-span-2">
            <ProfileDetails user={user} locale={locale} />
            <ProfileCourses
              courses={courses}
              isLoading={isLoadingCourses}
              locale={locale}
            />
          </div>

          {/* Right Column: Quick Links & Academy Information */}
          <ProfileSidebar locale={locale} />
        </div>
      </div>
    </main>
  );
}
