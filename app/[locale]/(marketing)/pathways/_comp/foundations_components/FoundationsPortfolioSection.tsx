import { useTranslations } from "next-intl";
import SectionHeader from "./ui/SectionHeader";
import {
  type ProgrammeItem,
  DEFAULT_PROGRAMMES,
} from "./foundations.constants";

export default function FoundationsPortfolioSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.portfolio");

  let programmes: ProgrammeItem[] = DEFAULT_PROGRAMMES;
  try {
    const raw = t.raw("programmes") as ProgrammeItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      programmes = raw;
    }
  } catch {
    programmes = DEFAULT_PROGRAMMES;
  }

  return (
    <section
      className="relative bg-white bg-[url('/images/foundations/bg_paths.jpg')] bg-cover bg-center py-20 lg:py-24 border-y border-fd-stone"
      id="portfolio"
    >
      <div
        className="absolute inset-0 bg-white/90 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1120px] mx-auto px-7">
        <SectionHeader
          title={t("title")}
          titleClassName="text-fd-navy!"
          lead={t("lead")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 border border-fd-stone rounded-md overflow-hidden">
          {programmes.map((p, idx) => (
            <article
              key={idx}
              className="p-8 sm:p-9 bg-fd-parchment text-fd-body flex flex-col border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-fd-gold-soft last:border-b-0 lg:last:border-r-0 rtl:lg:last:border-l-0"
            >
              <span
                className={`self-start inline-block text-[13px] font-semibold px-2.5 py-1 rounded-xs mb-4 leading-tight ${
                  p.live
                    ? "bg-fd-navy text-white"
                    : "bg-fd-gold-pale text-[#7a5f1d]"
                }`}
              >
                {p.status}
              </span>
              <div className="text-[14px] text-fd-gold font-semibold mb-2.5">
                {p.for}
              </div>
              <h3 className="font-serif text-[24px] font-semibold text-fd-navy! leading-[1.2]">
                {p.title}
              </h3>
              <p className="mt-3.5 text-[16px] text-fd-body leading-[1.55] flex-1 mb-0">
                {p.description}
              </p>
              <ul className="list-none my-6 p-0 space-y-2 text-[14.5px] text-fd-muted">
                {p.bullets.map((b, bIdx) => (
                  <li
                    key={bIdx}
                    className="flex items-baseline gap-2.5 leading-[1.45]"
                  >
                    <span
                      className="text-fd-gold select-none font-normal"
                      aria-hidden="true"
                    >
                      —
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a
                className="self-start text-fd-navy font-semibold no-underline border-b-[1.5px] border-fd-gold-soft hover:border-fd-gold pb-px transition-colors cursor-pointer"
                href={p.href}
              >
                {p.action}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
