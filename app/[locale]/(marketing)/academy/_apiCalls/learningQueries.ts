"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
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
export type AnswerOption = {
  id: string;
  source_key: string;
  sort_order: number;
  option_text: string;
  feedback: string | null;
};
export type AssessmentQuestion = {
  id: string;
  source_key: string;
  sort_order: number;
  is_critical: boolean;
  critical_label: string | null;
  stem: string;
  explanation: string | null;
  answer_options: AnswerOption[];
};
export type Assessment = {
  id: string;
  source_key: string;
  duration_seconds: number | null;
  pass_score: number | null;
  require_all_critical: boolean;
  allow_retry_per_question: boolean;
  feedback_policy: "after_answer" | "after_submit" | "never";
  assessment_questions?: AssessmentQuestion[];
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
  return apiRequest<LearningUnit>(
    `/api/academy/courses/${courseSlug}/units/${unitSlug}`,
  );
}

export function useLearningUnit(courseSlug: string, unitSlug: string) {
  return useQuery({
    queryKey: academyQueryKeys.unit(courseSlug, unitSlug),
    queryFn: () => getUnit(courseSlug, unitSlug),
  });
}

async function getCourseOutline(courseSlug: string): Promise<CourseOutline> {
  return apiRequest<CourseOutline>(`/api/academy/courses/${courseSlug}/outline`);
}

export function useCourseOutline(courseSlug: string) {
  return useQuery({
    queryKey: academyQueryKeys.course(courseSlug),
    queryFn: () => getCourseOutline(courseSlug),
  });
}
