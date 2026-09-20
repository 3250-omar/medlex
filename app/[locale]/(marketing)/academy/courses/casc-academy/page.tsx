import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CASC_PRIVATE_ROBOTS } from "@/lib/seo/metadata";
import CascOnboardingClient from "./_comps/CascOnboardingClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "ابدأ هنا — أكاديمية CASC | MedLex"
      : "Start here — The CASC Academy | MedLex",
    description: isAr
      ? "ست دقائق الآن ستوفر عليك ست ساعات لاحقاً. تعرف على آلية المحطات، تفكير الممتحن، وكيفية التحضير لاختبار CASC."
      : "Six minutes now will save you six hours later. Discover how stations work, examiner thinking, and the four key things candidates miss.",
    robots: CASC_PRIVATE_ROBOTS,
  };
}

export const dynamic = "force-dynamic";

export default async function CascAcademyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ intro?: string; force?: string }>;
}) {
  const { locale } = await params;
  const { intro, force } = await searchParams;
  const isForceIntro =
    intro === "true" || intro === "1" || force === "true" || force === "1";

  const cookieStore = await cookies();
  const hasSeenOnboarding =
    cookieStore.get("casc_onboarding_seen")?.value === "1";

  let continueSlug = "start-here";
  const firstUnitSlug = "start-here";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Query active/paused/completed enrollment for CASC Academy
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: enrollment, error: enrollErr } = await (supabase as any)
        .from("enrollments")
        .select("id, status, last_accessed_unit_id, courses!inner(id, slug)")
        .eq("user_id", user.id)
        .eq("courses.slug", "casc-academy")
        .in("status", ["active", "completed", "paused"])
        .maybeSingle();

      if (enrollErr) {
        console.error("[CASC Academy Page] Enrollment query error:", enrollErr);
      }

      if (enrollment) {
        // Fetch published course units to compute next due lesson
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: release } = await (supabase as any)
          .from("course_releases")
          .select("id")
          .eq("course_id", enrollment.courses.id)
          .eq("status", "published")
          .order("version_number", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (release) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: units } = await (supabase as any)
            .from("learning_units")
            .select("id, slug, sequence_number")
            .eq("release_id", release.id)
            .eq("is_published", true)
            .order("sequence_number", { ascending: true });

          if (units && units.length > 0) {
            continueSlug = String(units[0]?.slug ?? "start-here");

            // Query completed units from public.unit_progress
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: progressRecords } = await (supabase as any)
              .from("unit_progress")
              .select("unit_id, status")
              .eq("enrollment_id", enrollment.id);

            const completedUnitIds = new Set(
              (progressRecords || [])
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((p: any) => p.status === "completed")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((p: any) => String(p.unit_id)),
            );

            // Determine resume slug
            if (enrollment.last_accessed_unit_id) {
              const lastIndex = units.findIndex(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (u: any) =>
                  String(u.id) === String(enrollment.last_accessed_unit_id),
              );
              if (lastIndex !== -1) {
                if (
                  completedUnitIds.has(
                    String(enrollment.last_accessed_unit_id),
                  ) &&
                  lastIndex + 1 < units.length
                ) {
                  continueSlug = String(units[lastIndex + 1].slug);
                } else {
                  continueSlug = String(units[lastIndex].slug);
                }
              }
            } else {
              const firstIncomplete = units.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (u: any) => !completedUnitIds.has(String(u.id)),
              );
              if (firstIncomplete) {
                continueSlug = String(firstIncomplete.slug);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("[CASC Academy Page] Resolution error:", error);
  }

  // If user has already seen onboarding and not forcing intro
  if (!isForceIntro && hasSeenOnboarding) {
    redirect(
      `/${locale}/academy/courses/casc-academy/learn/${continueSlug || firstUnitSlug}`,
    );
  }

  return (
    <CascOnboardingClient
      locale={locale}
      continueSlug={continueSlug}
      firstUnitSlug={firstUnitSlug}
    />
  );
}
