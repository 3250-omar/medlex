import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "refundPage" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function RefundPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "refundPage" });

  const highlights = [
    {
      icon: (
        <svg
          className="size-5 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: t("highlightCourses"),
      desc: t("highlightCoursesSub"),
    },
    {
      icon: (
        <svg
          className="size-5 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t("highlightCoaching"),
      desc: t("highlightCoachingSub"),
    },
    {
      icon: (
        <svg
          className="size-5 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: t("highlightSpeed"),
      desc: t("highlightSpeedSub"),
    },
    {
      icon: (
        <svg
          className="size-5 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t("highlightHelp"),
      desc: t("highlightHelpSub"),
    },
  ];

  const courseRules = [
    {
      title: t("sec1Item1Title"),
      desc: (
        <span>
          {t("sec1Item1Desc").split("info@medlexsolutions.com")[0]}
          <a
            href="mailto:info@medlexsolutions.com"
            className="text-navy! font-semibold underline hover:text-gold transition-colors"
          >
            info@medlexsolutions.com
          </a>
          {t("sec1Item1Desc").split("info@medlexsolutions.com")[1]}
        </span>
      ),
      highlight: true,
    },
    {
      title: t("sec1Item2Title"),
      desc: <span>{t("sec1Item2Desc")}</span>,
      highlight: false,
    },
    {
      title: t("sec1Item3Title"),
      desc: <span>{t("sec1Item3Desc")}</span>,
      highlight: false,
    },
    {
      title: t("sec1Item4Title"),
      desc: <span>{t("sec1Item4Desc")}</span>,
      highlight: false,
    },
  ];

  const coachingPoints = [
    t("sec2Item1"),
    t("sec2Item2"),
    t("sec2Item3"),
    t("sec2Item4"),
    t("sec2Item5"),
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-char">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-16 md:pt-40 md:pb-20 on-navy text-lbody border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full px-6 sm:px-8 lg:max-w-4xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              {t("kicker")}
            </span>
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </div>

          <h1 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            {t("title")}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-gold/85 font-sans">
            <span>{t("brand")}</span>
            <span>•</span>
            <span>{t("lastUpdated")}</span>
          </div>

          <p className="mx-auto mt-6 max-w-2xl font-serif text-base sm:text-lg leading-relaxed text-lbody/90">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="border-b border-[#E8E2D5] bg-white py-8 sm:py-10 shadow-2xs">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="rounded-xl border border-hair bg-[#FAF8F5] hover:bg-[#F6F1E8] hover:border-[#DFD5C0] p-4.5 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-9 rounded-lg bg-white border border-[#E8E2D5] flex items-center justify-center shadow-2xs">
                    {h.icon}
                  </div>
                  <h4 className="font-serif text-sm sm:text-[15px] font-bold text-navy!">
                    {h.title}
                  </h4>
                </div>
                <p className="text-xs text-char/75 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 space-y-10">
          {/* Section 1: Online Courses */}
          <section className="bg-white rounded-2xl border border-hair p-7 sm:p-10 lg:p-12 shadow-xs">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy! mb-6 flex items-center gap-3 border-b border-[#EBE5D8] pb-5">
              <span className="text-gold font-serif font-bold text-xl sm:text-2xl">
                01
              </span>
              <span>{t("sec1Title")}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courseRules.map((rule, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-6 transition-all ${
                    rule.highlight
                      ? "border border-gold/40 bg-[#FAF7F0] shadow-xs"
                      : "border border-hair bg-[#FAF8F5]/60 hover:bg-white"
                  }`}
                >
                  <h3 className="font-serif text-base sm:text-lg font-bold text-navy! mb-2.5">
                    {rule.title}
                  </h3>
                  <div className="font-sans text-[14.5px] leading-relaxed text-char/85">
                    {rule.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Coaching */}
          <section className="bg-white rounded-2xl border border-hair p-7 sm:p-10 lg:p-12 shadow-xs">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy! mb-6 flex items-center gap-3 border-b border-[#EBE5D8] pb-5">
              <span className="text-gold font-serif font-bold text-xl sm:text-2xl">
                02
              </span>
              <span>{t("sec2Title")}</span>
            </h2>

            <ul className="space-y-3.5 font-sans text-[15px] sm:text-base leading-relaxed text-char/85">
              {coachingPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="size-2 rounded-full bg-gold shrink-0 mt-2.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3: How to ask */}
          <section className="rounded-2xl border border-gold/30 bg-[#F5EFE3]/80 p-7 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy!">
                {t("sec3Title")}
              </h2>
              <p className="font-sans text-[15px] sm:text-base leading-relaxed text-char/90">
                {t("sec3Body").split("info@medlexsolutions.com")[0]}
                <a
                  href="mailto:info@medlexsolutions.com"
                  className="text-navy! font-bold underline hover:text-gold transition-colors"
                >
                  info@medlexsolutions.com
                </a>
                {t("sec3Body").split("info@medlexsolutions.com")[1]}
              </p>
            </div>

            <a
              href="mailto:info@medlexsolutions.com?subject=Refund%20Request"
              className="inline-flex items-center gap-2 rounded-full bg-navy hover:bg-navy2 text-white font-sans text-sm font-semibold px-6 py-3 shrink-0 shadow-sm transition-all hover:scale-[1.02]"
            >
              <svg
                className="size-4 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>info@medlexsolutions.com</span>
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}