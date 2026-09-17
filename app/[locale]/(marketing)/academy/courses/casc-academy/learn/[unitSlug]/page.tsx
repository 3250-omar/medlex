import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LearningLesson from "../../../../_comps/LearningLesson";
import { CASC_PRIVATE_ROBOTS } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; unitSlug: string }>;
}): Promise<Metadata> {
  const { unitSlug } = await params;
  const fallbackTitle = "CASC Academy Lesson | MedLex";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        title: fallbackTitle,
        robots: CASC_PRIVATE_ROBOTS,
      };
    }

    // Verify active enrolment before disclosing unit details in title
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: enrollment } = await (supabase as any)
      .from("enrollments")
      .select("id, courses!inner(slug)")
      .eq("user_id", user.id)
      .eq("courses.slug", "casc-academy")
      .in("status", ["active", "completed", "paused"])
      .maybeSingle();

    if (!enrollment) {
      return {
        title: fallbackTitle,
        robots: CASC_PRIVATE_ROBOTS,
      };
    }

    // Only query minimal summary metadata - never expose questions or assessments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: unit } = await (supabase as any)
      .from("learning_units")
      .select("title, unit_code, summary")
      .eq("slug", unitSlug)
      .maybeSingle();

    if (!unit) {
      return {
        title: fallbackTitle,
        robots: CASC_PRIVATE_ROBOTS,
      };
    }

    const unitPrefix = unit.unit_code ? `${unit.unit_code}: ` : "";
    const title = `${unitPrefix}${unit.title} | CASC Academy | MedLex`;
    const description = unit.summary
      ? String(unit.summary).slice(0, 160)
      : undefined;

    return {
      title,
      description,
      robots: CASC_PRIVATE_ROBOTS,
    };
  } catch {
    return {
      title: fallbackTitle,
      robots: CASC_PRIVATE_ROBOTS,
    };
  }
}

export default async function CascLearningPage({
  params,
}: {
  params: Promise<{ locale: string; unitSlug: string }>;
}) {
  const { locale, unitSlug } = await params;
  return (
    <LearningLesson
      locale={locale}
      courseSlug="casc-academy"
      unitSlug={unitSlug}
    />
  );
}
