import type { ReactNode } from "react";
import LearningLessonLayout from "../../../_comps/LearningLessonLayout";

export default async function CascLearningLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <LearningLessonLayout locale={locale}>{children}</LearningLessonLayout>;
}