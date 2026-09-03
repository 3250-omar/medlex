"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
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
  currentUser: ["auth", "me"] as const,
  enrolledCourses: ["courses", "enrolled"] as const,
  course: (slug: string) => ["academy", "course", slug] as const,
  unit: (courseSlug: string, unitSlug: string) =>
    ["academy", "unit", courseSlug, unitSlug] as const,
};

async function readJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const body = (await response.json().catch(() => null)) as {
    data?: T;
    error?: string;
  } | null;
  if (!response.ok || body?.data === undefined)
    throw new Error(body?.error ?? "Unable to complete the request.");
  return body.data;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: academyQueryKeys.currentUser,
    queryFn: () => readJson<CurrentUser | null>("/api/auth/me"),
    staleTime: 30_000,
  });
}

export function useSubscribeToCourse() {
  return useMutation({
    mutationFn: (slug: string) =>
      readJson<Subscription>(`/api/courses/${slug}/subscribe`, {
        method: "POST",
      }),
  });
}

export function useEnrolledCourses() {
  return useQuery({
    queryKey: academyQueryKeys.enrolledCourses,
    queryFn: () => readJson<EnrolledCourse[]>("/api/courses/enrolled"),
  });
}
