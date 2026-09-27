import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createCollectionPageSchema } from "@/lib/seo/schema";
import { CANONICAL_ORIGIN } from "@/lib/seo/metadata";
import {
  ArrowRight,
  Scale,
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PathwaysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pathwaysOverview" });

  const collectionSchema = createCollectionPageSchema(
    locale,
    "/pathways",
    t("title"),
    t("intro"),
    [] // We can keep it empty for now or populate it statically if needed, but SEO schema ideally should wait. Since this is an async server component, it's fine to keep basic schema.
  );

  return (
    <div className="min-h-screen bg-navy text-lbody">
      <JsonLd data={collectionSchema} />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 sm:px-10 md:px-14 text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              {t("eyebrow")}
            </span>
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl font-normal">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-lbody/90 md:text-lg">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Pathways Grid */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <Suspense fallback={<GridSkeleton />}>
          <PathwaysData locale={locale} />
        </Suspense>

        {/* Founder Callout */}
        <div className="mt-16 rounded-xl border border-gold/30 bg-gradient-to-br from-[#0e1d30] to-[#162a45] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="rounded-full bg-gold/15 p-3.5 text-gold shrink-0">
              <UserCheck className="size-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                {t("founderNotice.title")}
              </h3>
              <p className="mt-2 font-sans text-sm text-lbody/90 max-w-2xl leading-relaxed">
                {t("founderNotice.description")}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/founder`}
            className="btn btn-gold shrink-0 text-sm font-semibold !px-6 !py-3 rounded-md"
          >
            {t("founderNotice.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}

async function PathwaysData({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "pathwaysOverview" });
  const supabase = await createClient();
  const { data: courses = [] } = await supabase
    .from("courses")
    .select(
      "slug, title_en, title_ar, description_en, description_ar, price, course_status",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const ICONS: Record<string, React.ElementType> = {
    "medico-legal": Scale,
    "casc-academy": GraduationCap,
    foundations: ShieldCheck,
  };

  const pathways = (courses || []).map((course) => {
    const title =
      locale === "ar" && course.title_ar ? course.title_ar : course.title_en;
    const description =
      locale === "ar" && course.description_ar
        ? course.description_ar
        : course.description_en;

    let badge = "";
    if (course.course_status === "active")
      badge = locale === "ar" ? "متاح الآن" : "Open now";
    else if (course.course_status === "waiting_list")
      badge = locale === "ar" ? "قائمة الانتظار مفتوحة" : "Waitlist open";
    else if (course.course_status === "launching")
      badge =
        locale === "ar"
          ? "البرامج الأولى قيد الإطلاق"
          : "First programmes launching";

    let cta = "";
    if (course.slug === "medico-legal") cta = t("medicoLegal.cta");
    else if (course.slug === "casc-academy") cta = t("cascAcademy.cta");
    else if (course.slug === "foundations") cta = t("foundations.cta");
    else cta = locale === "ar" ? "استكشف المسار" : "Explore the pathway";

    return {
      id: course.slug,
      href: `/${locale}/pathways/${course.slug}`,
      canonicalUrl: `${CANONICAL_ORIGIN}/${locale}/pathways/${course.slug}`,
      badge,
      title,
      description,
      cta,
      icon: ICONS[course.slug] || GraduationCap,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pathways.map((p) => {
        const Icon = p.icon;
        return (
          <div
            key={p.id}
            className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0e1d30]/80 p-8 transition-all duration-300 hover:border-gold/50 hover:bg-[#12233b] hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold tracking-wide">
                  {p.badge}
                </span>
                <Icon className="size-6 text-gold/70 group-hover:text-gold transition-colors" />
              </div>
              <h2 className="mt-6 font-serif text-2xl font-normal text-white group-hover:text-gold transition-colors leading-snug">
                {p.title}
              </h2>
              <p className="mt-4 font-sans text-sm leading-relaxed text-lbody/80">
                {p.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href={p.href}
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-gold group-hover:text-white transition-colors"
              >
                <span>{p.cta}</span>
                <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0e1d30]/80 p-8"
        >
          <div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
              <Skeleton className="size-6 rounded-full bg-white/10" />
            </div>
            <Skeleton className="mt-6 h-8 w-3/4 bg-white/10" />
            <Skeleton className="mt-4 h-4 w-full bg-white/10" />
            <Skeleton className="mt-2 h-4 w-5/6 bg-white/10" />
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <Skeleton className="h-5 w-32 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
