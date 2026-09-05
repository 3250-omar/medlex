"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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
};

export const academyQueryKeys = {
  authenticated: ["authenticated"] as const,
  currentUser: ["auth", "me"] as const,
  enrolledCourses: ["authenticated", "courses", "enrolled"] as const,
  course: (slug: string) =>
    ["authenticated", "academy", "course", slug] as const,
  unit: (courseSlug: string, unitSlug: string) =>
    ["authenticated", "academy", "unit", courseSlug, unitSlug] as const,
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
