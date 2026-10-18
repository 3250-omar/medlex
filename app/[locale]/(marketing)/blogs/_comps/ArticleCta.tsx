import Link from "next/link";
import { useMemo } from "react";

interface ArticleCtaProps {
  locale: string;
  category?: string | null;
  isRtl?: boolean;
}

export function ArticleCta({
  locale,
  category = "casc",
  isRtl = false,
}: ArticleCtaProps) {
  const ctaContent = useMemo(() => {
    const cat = category?.toLowerCase();

    if (cat === "casc") {
      return {
        heading: isRtl
          ? "أتقن امتحان الزمالة الملكية البريطانية CASC"
          : "Master the MRCPsych CASC Examination",
        description: isRtl
          ? "تدريب سريري استشاري مكثف، ومحاكاة دقيقة للمحطات، وأطر استشارية مجربة لاجتياز الامتحان."
          : "Structured consultant-led practice, realistic simulated stations, and candidate-tested clinical consultation frameworks.",
        buttonText: isRtl ? "استكشف أكاديمية CASC" : "Explore CASC Academy",
        href: `/${locale}/pathways/casc-academy`,
      };
    }

    if (cat === "medico-legal") {
      return {
        heading: isRtl
          ? "طوّر ممارستك في كتابة التقارير النفسية القضائية"
          : "Advance Your Medicolegal Expert Practice",
        description: isRtl
          ? "صياغة التقارير الطبية القانونية للمحاكم، وتقييم المخاطر، وتقديم الشهادة كخبير أمام القضاء."
          : "Defensible court report drafting, psychiatric risk evaluation, and expert witness testimony from experienced faculty.",
        buttonText: isRtl
          ? "استكشف مسار التقارير القانونية"
          : "Explore Medicolegal Pathway",
        href: `/${locale}/pathways/medico-legal`,
      };
    }

    return {
      heading: isRtl
        ? "طوّر ممارستك الطبية القانونية والسريرية"
        : "Advance your medicolegal and clinical practice",
      description: isRtl
        ? "مسارات يقودها المؤسس في كتابة تقارير الخبراء أمام المحاكم، وإتقان امتحان CASC، والقيادة المؤسسية."
        : "Founder-led pathways in expert witness court reporting, CASC examination mastery and institutional leadership.",
      buttonText: isRtl ? "استكشف المسارات" : "Explore pathways",
      href: `/${locale}#pathways`,
    };
  }, [category, isRtl, locale]);

  return (
    <section className="my-16 p-8 sm:p-10 rounded-[22px] bg-gradient-to-r from-[#17305a] to-[#0b1a30] border border-[#d6b03f] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
      <div>
        <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#f3efe4] mb-2 leading-snug">
          {ctaContent.heading}
        </h2>
        <p className="text-sm sm:text-base text-[#c9d3e3] max-w-[54ch] leading-relaxed">
          {ctaContent.description}
        </p>
      </div>

      <Link
        href={ctaContent.href}
        data-cta-placement="article_bottom"
        data-cta-category={category || "general"}
        className="inline-flex items-center gap-2 bg-[#d6b03f] hover:bg-[#e8cd7a] text-[#0b1a30] font-semibold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-200 shrink-0 shadow-md self-start md:self-auto cursor-pointer group"
      >
        <span>{ctaContent.buttonText}</span>
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
