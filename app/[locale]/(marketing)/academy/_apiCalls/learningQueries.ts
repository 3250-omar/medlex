"use client";

import { useQuery } from "@tanstack/react-query";
import { academyQueryKeys } from "../../_apiCalls/academyQueries";

export type ContentBlock = {
  id: string;
  block_type: string;
  sort_order: number;
  content: { html?: string };
};
export type LearningUnit = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  eyebrow: string | null;
  lens_text: string | null;
  unit_code: string | null;
  sequence_number: number;
  content_blocks: ContentBlock[];
  assessments: Assessment[];
};
export type Assessment = {
  id: string;
  source_key: "learn" | "exam" | "gate";
  duration_seconds: number | null;
  pass_score: number | null;
  require_all_critical: boolean;
  allow_retry_per_question: boolean;
  feedback_policy: "after_answer" | "after_submit" | "never";
};
export type CourseOutline = {
  course: { slug: string; title: string };
  units: Array<{
    id: string;
    slug: string;
    title: string;
    unitCode: string | null;
    sequenceNumber: number;
    progressPercent: number;
    status: string | null;
  }>;
};

async function getUnit(
  courseSlug: string,
  unitSlug: string,
): Promise<LearningUnit> {
  const response = await fetch(
    `/api/academy/courses/${courseSlug}/units/${unitSlug}`,
  );
  const body = (await response.json().catch(() => null)) as {
    data?: LearningUnit;
    error?: string;
  } | null;
  if (!response.ok || !body?.data)
    throw new Error(body?.error ?? "Unable to load this lesson.");
  return body.data;
}

export function useLearningUnit(courseSlug: string, unitSlug: string) {
  return useQuery({
    queryKey: academyQueryKeys.unit(courseSlug, unitSlug),
    queryFn: () => getUnit(courseSlug, unitSlug),
  });
}

async function getCourseOutline(courseSlug: string): Promise<CourseOutline> {
  const response = await fetch(`/api/academy/courses/${courseSlug}/outline`);
  const body = (await response.json().catch(() => null)) as {
    data?: CourseOutline;
    error?: string;
  } | null;
  if (!response.ok || !body?.data)
    throw new Error(body?.error ?? "Unable to load the course outline.");
  return body.data;
}

export function useCourseOutline(courseSlug: string) {
  return useQuery({
    queryKey: academyQueryKeys.course(courseSlug),
    queryFn: () => getCourseOutline(courseSlug),
  });
}
