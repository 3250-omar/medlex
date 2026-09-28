import Link from "next/link";
import { useMemo } from "react";

interface ArticleCtaProps {
  locale: string;
  isRtl?: boolean;
}

export function ArticleCta({ locale, isRtl = false }: ArticleCtaProps) {
  const heading = useMemo(
    () =>
      isRtl
        ? "طوّر ممارستك الطبية القانونية والسريرية"
        : "Advance your medicolegal and clinical practice",
    [isRtl],
  );

  const description = useMemo(
    () =>
      isRtl
        ? "مسارات يقودها المؤسس في كتابة تقارير الخبراء أمام المحاكم، وإتقان امتحان CASC، والقيادة المؤسسية."
        : "Founder-led pathways in expert witness court reporting, CASC examination mastery and institutional leadership.",
    [isRtl],
  );

  const buttonText = useMemo(
    () => (isRtl ? "استكشف المسارات" : "Explore pathways"),
    [isRtl],
  );

  return (
    <section className="my-16 p-8 sm:p-10 rounded-[22px] bg-gradient-to-r from-[#17305a] to-[#0b1a30] border border-[#d6b03f] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
      <div>
        <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#f3efe4] mb-2 leading-snug">
          {heading}
        </h2>
        <p className="text-sm sm:text-base text-[#c9d3e3] max-w-[54ch] leading-relaxed">
          {description}
        </p>
      </div>

      <Link
        href={`/${locale}#pathways`}
        className="inline-flex items-center gap-2 bg-[#d6b03f] hover:bg-[#e8cd7a] text-[#0b1a30] font-semibold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-200 shrink-0 shadow-md self-start md:self-auto cursor-pointer group"
      >
        <span>{buttonText}</span>
        <svg
          className={`w-4 h-4 stroke-current fill-none transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${
            isRtl ? "rotate-180" : ""
          }`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
