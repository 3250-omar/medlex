import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TermsSidebar from "../terms/_comp/TermsSidebar";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });

  const tableRows = [
    {
      when: t("row1When"),
      collect: t("row1Collect"),
      use: t("row1Use"),
    },
    {
      when: t("row2When"),
      collect: t("row2Collect"),
      use: t("row2Use"),
    },
    {
      when: t("row3When"),
      collect: t("row3Collect"),
      use: t("row3Use"),
    },
    {
      when: t("row4When"),
      collect: t("row4Collect"),
      use: t("row4Use"),
    },
    {
      when: t("row5When"),
      collect: t("row5Collect"),
      use: t("row5Use"),
    },
    {
      when: t("row6When"),
      collect: t("row6Collect"),
      use: t("row6Use"),
    },
  ];

  const processors = [
    { label: t("sec4Item1Label"), desc: t("sec4Item1Desc") },
    { label: t("sec4Item2Label"), desc: t("sec4Item2Desc") },
    { label: t("sec4Item3Label"), desc: t("sec4Item3Desc") },
    { label: t("sec4Item4Label"), desc: t("sec4Item4Desc") },
    { label: t("sec4Item5Label"), desc: t("sec4Item5Desc") },
    { label: t("sec4Item6Label"), desc: t("sec4Item6Desc") },
    { label: t("sec4Item7Label"), desc: t("sec4Item7Desc") },
    { label: t("sec4Item8Label"), desc: t("sec4Item8Desc") },
  ];

  const sections = [
    {
      id: "1",
      num: 1,
      title: t("sec1Title"),
      content: (
        <p>
          {t("sec1Body").split(" — ")[0]} —{" "}
          <a
            href="mailto:info@medlexsolutions.com"
            className="text-navy! font-semibold underline hover:text-gold transition-colors"
          >
            info@medlexsolutions.com
          </a>
        </p>
      ),
    },
    {
      id: "2",
      num: 2,
      title: t("sec2Title"),
      content: (
        <div className="space-y-5">
          {/* Responsive Table for Data Collection */}
          <div className="overflow-x-auto rounded-xl border border-[#DFD5C0] bg-white shadow-2xs">
            <table className="w-full text-left rtl:text-right border-collapse text-xs sm:text-[13.5px]">
              <thead>
                <tr className="border-b border-[#DFD5C0] bg-[#FAF8F5] text-navy! font-serif font-bold">
                  <th className="py-3 px-4 sm:px-5 w-1/4">{t("thWhen")}</th>
                  <th className="py-3 px-4 sm:px-5 w-5/12">{t("thCollect")}</th>
                  <th className="py-3 px-4 sm:px-5 w-1/3">{t("thUse")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5D8] font-sans text-char/85">
                {tableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#FAF8F5]/60 transition-colors"
                  >
                    <td className="py-3 px-4 sm:px-5 font-semibold text-navy! align-top">
                      {row.when}
                    </td>
                    <td className="py-3 px-4 sm:px-5 leading-relaxed align-top">
                      {row.collect}
                    </td>
                    <td className="py-3 px-4 sm:px-5 leading-relaxed align-top">
                      {row.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important Patient Data Disclaimer */}
          <div className="rounded-xl border border-gold/40 bg-[#F5EFE3]/80 p-4 sm:p-5 flex items-start gap-3">
            <span
              className="text-gold font-bold text-lg leading-none mt-0.5"
              aria-hidden="true"
            >
              ⚑
            </span>
            <p className="text-xs sm:text-[14px] leading-relaxed text-char/90 font-medium">
              {t("sec2Disclaimer")}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "3",
      num: 3,
      title: t("sec3Title"),
      content: <p>{t("sec3Body")}</p>,
    },
    {
      id: "4",
      num: 4,
      title: t("sec4Title"),
      content: (
        <div className="space-y-4">
          <ul className="space-y-2.5">
            {processors.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-gold font-bold shrink-0 mt-0.5">•</span>
                <span>
                  <strong className="text-navy! font-semibold">
                    {item.label}:
                  </strong>{" "}
                  {item.desc}
                </span>
              </li>
            ))}
          </ul>
          <p className="pt-2 text-xs sm:text-[13.5px] text-char/75 leading-relaxed border-t border-[#EBE5D8]">
            {t("sec4Transfer")}
          </p>
        </div>
      ),
    },
    {
      id: "5",
      num: 5,
      title: t("sec5Title"),
      content: (
        <ul className="space-y-2">
          {t("sec5Body")
            .split("; ")
            .map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-gold font-bold shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
        </ul>
      ),
    },
    {
      id: "6",
      num: 6,
      title: t("sec6Title"),
      content: <p>{t("sec6Body")}</p>,
    },
    {
      id: "7",
      num: 7,
      title: t("sec7Title"),
      content: (
        <p>
          {t("sec7Body").split("info@medlexsolutions.com")[0]}
          <a
            href="mailto:info@medlexsolutions.com"
            className="text-navy! font-semibold underline hover:text-gold transition-colors"
          >
            info@medlexsolutions.com
          </a>
          {t("sec7Body").split("info@medlexsolutions.com")[1]}
        </p>
      ),
    },
    {
      id: "8",
      num: 8,
      title: t("sec8Title"),
      content: <p>{t("sec8Body")}</p>,
    },
    {
      id: "9",
      num: 9,
      title: t("sec9Title"),
      content: <p>{t("sec9Body")}</p>,
    },
    {
      id: "10",
      num: 10,
      title: t("sec10Title"),
      content: <p>{t("sec10Body")}</p>,
    },
  ];

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
      title: t("highlightNoHealth"),
      desc: t("highlightNoHealthSub"),
      sectionId: "2",
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      title: t("highlightController"),
      desc: t("highlightControllerSub"),
      sectionId: "1",
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: t("highlightSecurity"),
      desc: t("highlightSecuritySub"),
      sectionId: "8",
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: t("highlightRights"),
      desc: t("highlightRightsSub"),
      sectionId: "7",
    },
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
              <a
                key={i}
                href={`#section-${h.sectionId}`}
                className="group rounded-xl border border-hair bg-[#FAF8F5] hover:bg-[#F6F1E8] hover:border-[#DFD5C0] p-4.5 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-9 rounded-lg bg-white border border-[#E8E2D5] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {h.icon}
                  </div>
                  <h4 className="font-serif text-sm sm:text-[15px] font-bold text-navy! group-hover:text-gold transition-colors">
                    {h.title}
                  </h4>
                </div>
                <p className="text-xs text-char/75 leading-relaxed">{h.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Document Body with Split Sticky Sidebar */}
      <main className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-14 items-start">
            {/* Sticky Table of Contents */}
            <TermsSidebar
              sections={sections.map((s) => ({
                id: s.id,
                num: s.num,
                title: s.title,
              }))}
              title={t("tableOfContents")}
              backToTopText={t("backToTop")}
            />

            {/* Articles Document */}
            <div className="flex-1 w-full min-w-0">
              <div className="bg-white rounded-2xl border border-hair p-7 sm:p-10 lg:p-12 shadow-xs">
                {sections.map((section, idx) => (
                  <article
                    key={section.id}
                    id={`section-${section.id}`}
                    className={`scroll-mt-28 ${
                      idx !== sections.length - 1
                        ? "border-b border-[#EBE5D8] pb-8 mb-8 sm:pb-10 sm:mb-10"
                        : ""
                    }`}
                  >
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy! mb-4 flex items-baseline gap-3">
                      <span className="text-gold font-serif font-bold text-lg sm:text-xl shrink-0">
                        {section.num}
                      </span>
                      <span>{section.title}</span>
                    </h2>
                    <div className="font-sans text-[15px] sm:text-base leading-[1.8] text-char/85">
                      {section.content}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
