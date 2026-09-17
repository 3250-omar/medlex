import { useTranslations } from "next-intl";
import SectionHeader from "./ui/SectionHeader";

export default function FoundationsLeadershipSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.leadership");

  return (
    <section
      className="bg-fd-navy-deep text-white border-b border-white/10 py-20 lg:py-24"
      id="leadership"
    >
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center mb-11">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleClassName="text-white!"
            lead={t("lead")}
            className="mb-0 "
            leadClassName={"text-white!"}
          />
          <figure className="m-0">
            <img
              src="/images/foundations/leadership_workshop.jpg"
              alt="Clinicians in a leadership workshop"
              className="rounded-md aspect-[16/11] object-cover w-full border border-fd-gold-soft/50 shadow-[0_24px_50px_rgba(0,0,0,0.35)]"
            />
          </figure>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="border border-fd-gold-soft/45 rounded-md p-8 sm:p-8.5 bg-fd-navy-deep/50">
            <h3 className="font-serif text-white text-[22px] font-semibold mb-3">
              {t("learn.title")}
            </h3>
            <p className="text-[#dce1ea] text-[15.5px] leading-[1.6] mb-5">
              {t("learn.description")}
            </p>
            <div className="inline-block border border-fd-gold-soft/60 rounded-full px-3.5 py-1.5 text-[13px] text-fd-gold-soft font-medium">
              {t("learn.tag")}
            </div>
          </article>

          <article className="border border-fd-gold-soft/45 rounded-md p-8 sm:p-8.5 bg-fd-navy-deep/50">
            <h3 className="font-serif text-white text-[22px] font-semibold mb-3">
              {t("runs.title")}
            </h3>
            <p className="text-[#dce1ea] text-[15.5px] leading-[1.6] mb-5">
              {t("runs.description")}
            </p>
            <div className="inline-block border border-fd-gold-soft/60 rounded-full px-3.5 py-1.5 text-[13px] text-fd-gold-soft font-medium">
              {t("runs.tag")}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
