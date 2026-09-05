"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  username?: string | null;
  phone?: string | null;
  createdAt?: string | null;
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
};

export function useCurrentUser() {
  return useQuery({
    queryKey: academyQueryKeys.currentUser,
    queryFn: () => apiRequest<CurrentUser | null>("/api/auth/me"),
    staleTime: 30_000,
  });
}

export function useSubscribeToCourse() {
  return useMutation({
    mutationFn: (slug: string) =>
      apiRequest<Subscription>(`/api/courses/${slug}/subscribe`, {
        method: "POST",
      }),
  });
}

export function useEnrolledCourses(enabled = true) {
  return useQuery({
    queryKey: academyQueryKeys.enrolledCourses,
    queryFn: () => apiRequest<EnrolledCourse[]>("/api/courses/enrolled"),
    enabled,
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
    }: {
      courseSlug: string;
      unitSlug: string;
    }) =>
      apiRequest<UnitCompletionResult>(
        `/api/academy/courses/${courseSlug}/units/${unitSlug}/complete`,
        { method: "POST" },
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
