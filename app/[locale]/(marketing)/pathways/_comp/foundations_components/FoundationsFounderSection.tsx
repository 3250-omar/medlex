import Link from "next/link";
import { useTranslations } from "next-intl";
import SectionHeader from "./ui/SectionHeader";
import {
  type PrincipleItem,
  DEFAULT_FOUNDER_PRINCIPLES,
  FOUNDER_ICONS,
} from "./foundations.constants";

type Props = {
  locale: string;
};

export default function FoundationsFounderSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.foundationsLanding.founder");

  const principles: PrincipleItem[] =
    (t.raw("principles") as PrincipleItem[]) || DEFAULT_FOUNDER_PRINCIPLES;

  return (
    <section
      className="bg-white border-b border-fd-stone py-20 lg:py-24 text-fd-body"
      id="founder"
    >
      <div className="max-w-[1120px] mx-auto px-7">
        <SectionHeader
          title={t("title")}
          titleClassName="text-fd-navy!"
          lead={t("lead")}
        />

        {/* Founder Profile Badge */}
        <div className="flex items-center gap-4.5 mt-7 p-4 sm:p-5 border border-fd-gold-soft/45 rounded-md bg-fd-navy max-w-[560px] text-white shadow-[0_8px_24px_rgba(20,40,75,0.12)]">
          <img
            src="/images/foundations/dr_ahmed_abouelghit.jpg"
            alt={t("name")}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-[1.5px] border-fd-gold-soft shrink-0"
          />
          <div>
            <b className="block font-serif text-[18px] text-white font-medium leading-[1.25]">
              {t("name")}
            </b>
            <span className="block text-[13.5px] text-[#c9d0dc] my-1 leading-[1.35]">
              {t("role")}
            </span>
            <Link
              className="inline-block text-[14px] font-semibold text-white border-b-[1.5px] border-fd-gold pb-px hover:text-fd-gold-soft hover:border-fd-gold-soft transition-colors"
              href={`/${locale}/founder`}
            >
              {t("profileLink")}
            </Link>
          </div>
        </div>

        {/* Pull Quote */}
        <blockquote className="mt-8.5 py-2 pl-6 rtl:pl-0 rtl:pr-6 border-l-[3px] rtl:border-l-0 rtl:border-r-[3px] border-fd-gold font-serif text-[23px] leading-[1.35] text-fd-navy max-w-[68ch]">
          {t("quote")}
          <cite className="block font-sans not-italic text-[12px] tracking-[0.12em] text-fd-gold mt-2.5 font-semibold uppercase">
            {t("quoteCite")}
          </cite>
        </blockquote>

        {/* 2x2 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-13">
          {principles.map((p, idx) => (
            <article
              key={idx}
              className="border border-fd-stone rounded-md p-7 sm:p-8 bg-fd-parchment grid grid-cols-[auto_1fr] gap-x-5 items-start hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(20,40,75,0.08)] transition-all duration-200"
            >
              <div className="row-span-3 w-[52px] h-[52px] rounded-full bg-fd-navy flex items-center justify-center shrink-0 [&_svg]:w-[26px] [&_svg]:h-[26px] [&_svg]:stroke-fd-gold-soft [&_svg]:stroke-[1.6]">
                {FOUNDER_ICONS[idx % FOUNDER_ICONS.length]}
              </div>
              <h3 className="col-start-2 font-serif text-[21px] font-semibold text-fd-navy! mb-2 leading-[1.25]">
                {p.title}
              </h3>
              <p className="col-start-2 font-sans text-[15.5px] text-fd-body leading-[1.55] m-0">
                {p.description}
              </p>
              <div className="col-start-2 font-sans pt-4 text-[13px] text-fd-gold font-semibold tracking-[0.02em]">
                {p.tag}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
