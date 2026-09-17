import { useTranslations } from "next-intl";
import SectionHeader from "./ui/SectionHeader";
import {
  type AudienceItem,
  DEFAULT_AUDIENCES,
} from "./foundations.constants";

export default function FoundationsAudienceSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.audience");

  const audiences: AudienceItem[] =
    (t.raw("items") as AudienceItem[]) || DEFAULT_AUDIENCES;

  return (
    <section className="bg-fd-parchment py-20 lg:py-26 text-fd-body">
      <div className="max-w-[1120px] mx-auto px-7">
        <SectionHeader
          title={t("title")}
          titleClassName="text-fd-navy!"
          kicker={t("kicker")}
          rule={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-18 items-start mt-11">
          <div>
            <p className="text-[16px] leading-[1.6] text-fd-body max-w-[64ch]">
              {t("p1")}
            </p>
            <p className="text-[16px] leading-[1.6] text-fd-body max-w-[64ch] mt-4.5">
              {t("p2")}
            </p>
            <blockquote className="mt-8.5 py-2.5 pl-6.5 rtl:pl-0 rtl:pr-6.5 border-l-[3px] rtl:border-l-0 rtl:border-r-[3px] border-fd-gold font-serif text-[clamp(22px,2.4vw,28px)] leading-[1.35] text-fd-navy">
              {t("quote")}
              <cite className="block font-sans not-italic text-[12.5px] tracking-[0.12em] uppercase text-fd-gold mt-3.5">
                {t("quoteCite")}
              </cite>
            </blockquote>
          </div>

          <div className="border border-fd-navy rounded-md p-7 bg-fd-navy text-white shadow-[0_24px_50px_rgba(20,40,75,0.2)]">
            <h3 className="font-serif text-white text-[20px] font-semibold mb-4">
              {t("cardTitle")}
            </h3>
            {audiences.map((item, idx) => (
              <div key={idx} className="py-3.5 border-t border-white/14">
                <b className="block text-fd-gold-soft text-[16px] font-semibold mb-1">
                  {item.role}
                </b>
                <span className="block text-[#dce1ea] text-[15px] leading-[1.5]">
                  {item.description}
                </span>
              </div>
            ))}
            <p className="mt-3.5 text-[13.5px] text-[#c9d0dc]">
              {t("note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
