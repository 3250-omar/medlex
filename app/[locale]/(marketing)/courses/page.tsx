import { getTranslations } from "next-intl/server";
import EnrolledCourses from "./_comps/EnrolledCourses";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enrolledCourses" });

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-navy on-navy pb-24 pt-32 text-lbody sm:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)]"
      />

      <section className="relative mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="max-w-3xl">
          <p className="kicker text-gold">{t("kicker")}</p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-normal leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
            {t("pageDescription")}
          </p>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10">
          <EnrolledCourses />
        </div>
      </section>
    </main>
  );
}
