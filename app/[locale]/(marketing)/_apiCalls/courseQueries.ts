"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

export interface PublicCourse {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  price: number;
  access_duration_days: number;
  points_on_completion: number;
  is_published: boolean;
  created_at: string;
}

export const courseQueryKeys = {
  all: ["courses"] as const,
  published: () => [...courseQueryKeys.all, "published"] as const,
};

async function getPublishedCourses(): Promise<PublicCourse[]> {
  return apiRequest<PublicCourse[]>("/api/courses");
}

export function usePublishedCourses() {
  return useQuery({
    queryKey: courseQueryKeys.published(),
    queryFn: getPublishedCourses,
    staleTime: 60_000,
  });
}
