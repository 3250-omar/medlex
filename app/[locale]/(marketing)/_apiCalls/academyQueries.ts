"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

export type UserUpcomingBooking = {
  id: string;
  courseSlug: string;
  startsAt: string;
  endsAt: string;
  status: string;
  fundingType: "direct_payment" | "package_credit" | string;
  joinUrl: string | null;
  sessionLink: string | null;
  meetingStatus?: string;
  emailStatus?: string;
};

export type UserPrivateSessionPackage = {
  id: string;
  courseSlug: string;
  packageCode: string | null;
  purchased: number;
  remaining: number;
  status: string;
};

export type UserPrivateSessionsSummary = {
  hasActiveSession: boolean;
  sessionType: "none" | "direct" | "package" | "both";
  hasUpcomingBooking: boolean;
  nextBooking: UserUpcomingBooking | null;
  upcomingBookings: UserUpcomingBooking[];
  hasPackage: boolean;
  totalRemainingCredits: number;
  packages: UserPrivateSessionPackage[];
};

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  username?: string | null;
  phone?: string | null;
  examDate?: string | null;
  role?: "learner" | "admin" | string | null;
  emailVerified?: boolean;
  avatarPath?: string | null;
  avatarUrl?: string | null;
  createdAt?: string | null;
  enrolledCourses?: EnrolledCourse[];
  privateSessions?: UserPrivateSessionsSummary;
};
export type Subscription = {
  enrollmentId: string;
  releaseId: string;
  firstUnitSlug: string | null;
};
export type EnrolledCourse = {
  enrollmentId: string;
  status: string;
  expiresAt: string | null;
  slug: string;
  titleEn: string;
  titleAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  firstUnitSlug: string | null;
  currentUnitSlug: string | null;
  completedUnits: number;
  totalUnits: number;
  progressPercent: number;
  privateSessions?: UserUpcomingBooking[];
};

export const academyQueryKeys = {
  authenticated: ["authenticated"] as const,
  currentUser: ["auth", "me"] as const,
  enrolledCourses: ["authenticated", "courses", "enrolled"] as const,
  course: (slug: string) =>
    ["authenticated", "academy", "course", slug] as const,
  unit: (courseSlug: string, unitSlug: string) =>
    ["authenticated", "academy", "unit", courseSlug, unitSlug] as const,
  certificateStatus: (slug: string) =>
    ["academy", "course", slug, "certificate"] as const,
  giftStatus: ["gifts", "status"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: academyQueryKeys.currentUser,
    queryFn: () => apiRequest<CurrentUser | null>("/api/auth/me"),
    staleTime: 30_000,
  });
}

export type SubscribeParams =
  | string
  | {
      slug: string;
      waiverAccepted?: boolean;
      waiverText?: string;
    };

export function useSubscribeToCourse() {
  return useMutation({
    mutationFn: (params: SubscribeParams) => {
      const slug = typeof params === "string" ? params : params.slug;
      const body =
        typeof params === "object"
          ? {
              waiverAccepted: params.waiverAccepted,
              waiverText: params.waiverText,
            }
          : undefined;

      return apiRequest<Subscription>(`/api/courses/${slug}/subscribe`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
    },
  });
}

export function useEnrolledCourses(enabled = true) {
  return useQuery({
    queryKey: academyQueryKeys.enrolledCourses,
    queryFn: () => apiRequest<EnrolledCourse[]>("/api/courses/enrolled"),
    enabled,
  });
}

export type GiftStatus = {
  gift1Downloaded: boolean;
  gift1DownloadedAt: string | null;
  gift2Downloaded: boolean;
  gift2DownloadedAt: string | null;
};

export function useGiftStatus(enabled = true) {
  return useQuery({
    queryKey: academyQueryKeys.giftStatus,
    queryFn: () => apiRequest<GiftStatus>("/api/gifts/status"),
    enabled,
    staleTime: 60_000,
  });
}

export type UnitCompletionResult = {
  completed: boolean;
  unitId: string;
  unitSlug: string;
  completedUnits: number;
  totalUnits: number;
  progressPercent: number;
  isCourseCompleted: boolean;
  nextUnitSlug: string | null;
};

export function useCompleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseSlug,
      unitSlug,
      isExam,
      score,
      total,
    }: {
      courseSlug: string;
      unitSlug: string;
      isExam?: boolean;
      score?: number;
      total?: number;
    }) =>
      apiRequest<UnitCompletionResult>(
        `/api/academy/courses/${courseSlug}/units/${unitSlug}/complete`,
        {
          method: "POST",
          headers:
            isExam !== undefined
              ? { "Content-Type": "application/json" }
              : undefined,
          body:
            isExam !== undefined
              ? JSON.stringify({ isExam, score, total })
              : undefined,
        },
      ),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: academyQueryKeys.enrolledCourses,
      });
      void queryClient.invalidateQueries({
        queryKey: academyQueryKeys.course(variables.courseSlug),
      });
    },
  });
}

export type RefundEligibilityResult = {
  enrolled: boolean;
  enrollmentId?: string;
  enrolledAt?: string;
  daysElapsed?: number;
  isWithin14Days?: boolean;
  examModeCompletions?: number;
  maxAllowedExamCompletions?: number;
  completedStationsCount?: number;
  cancellationWaiverAccepted?: boolean;
  cancellationWaiverAcceptedAt?: string | null;
  cancellationWaiverText?: string | null;
  isRefundEligible?: boolean;
  reason?: string;
};

export function useRefundEligibility(courseSlug: string, enabled = true) {
  return useQuery({
    queryKey: ["refundEligibility", courseSlug],
    queryFn: () =>
      apiRequest<RefundEligibilityResult>(
        `/api/courses/${courseSlug}/refund-eligibility`,
      ),
    enabled: Boolean(courseSlug) && enabled,
    staleTime: 30_000,
  });
}

export function useOpenUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseSlug,
      unitSlug,
    }: {
      courseSlug: string;
      unitSlug: string;
    }) =>
      apiRequest<{ success: boolean; unitId: string; unitSlug: string }>(
        `/api/academy/courses/${courseSlug}/units/${unitSlug}/open`,
        { method: "POST" },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: academyQueryKeys.enrolledCourses,
      });
    },
  });
}

export type CertificateStatus = {
  enrolled: boolean;
  eligible: boolean;
  progress_percent: number;
  completed_units: number;
  total_units: number;
  course_title: string;
  user_name: string;
  completion_date?: string;
  has_certificate: boolean;
  certificate?: {
    id: string;
    certificate_number: string;
    recipient_name: string;
    course_title: string;
    issued_at: string;
  } | null;
};

export function useCertificateStatus(courseSlug: string, enabled = true) {
  return useQuery({
    queryKey: academyQueryKeys.certificateStatus(courseSlug),
    queryFn: () =>
      apiRequest<CertificateStatus>(
        `/api/academy/courses/${courseSlug}/certificate`,
      ),
    enabled: Boolean(courseSlug) && enabled,
  });
}

export function useIssueCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseSlug,
      recipientName,
    }: {
      courseSlug: string;
      recipientName?: string;
    }) =>
      apiRequest<{
        success: boolean;
        certificate_number: string;
        recipient_name: string;
      }>(`/api/academy/courses/${courseSlug}/certificate`, {
        method: "POST",
        body: JSON.stringify({ recipient_name: recipientName }),
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: academyQueryKeys.certificateStatus(variables.courseSlug),
      });
    },
  });
}
