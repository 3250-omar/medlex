"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import CourseLessonMenu from "./CourseLessonMenu";
import { useCourseOutline } from "../_apiCalls/learningQueries";

type LearningLessonLayoutProps = {
  children: ReactNode;
  locale: string;
};

/**
 * Lives at the stable `learn` route boundary, so the menu keeps its local UI
 * state (such as collapsed/expanded groups) as the active lesson changes.
 */
export default function LearningLessonLayout({
  children,
  locale,
}: LearningLessonLayoutProps) {
  const { unitSlug } = useParams<{ unitSlug: string }>();
  const { data: outline } = useCourseOutline("casc-academy");

  return (
    <>
      {children}
      {outline && unitSlug ? (
        <CourseLessonMenu
          courseSlug="casc-academy"
          currentUnitSlug={unitSlug}
          locale={locale}
          outline={outline}
        />
      ) : null}
    </>
  );
}