import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LearningLessonLayout from "../../../_comps/LearningLessonLayout";

export default async function CascLearningLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const cookieStore = await cookies();
  if (cookieStore.get("casc_onboarding_seen")?.value !== "1") {
    redirect(`/${locale}/academy/courses/casc-academy`);
  }

  return <LearningLessonLayout locale={locale}>{children}</LearningLessonLayout>;
}