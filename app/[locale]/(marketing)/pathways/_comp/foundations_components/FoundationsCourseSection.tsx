import Link from "next/link";
import { useTranslations } from "next-intl";
import SectionHeader from "./ui/SectionHeader";
import {
  type ModuleItem,
  type GetItem,
  DEFAULT_MODULES,
  DEFAULT_WHAT_YOU_GET,
} from "./foundations.constants";

type Props = {
  locale: string;
};

export default function FoundationsCourseSection({ locale }: Props) {
  const t = useTranslations("pathwayPages.foundationsLanding.course");

  let modules: ModuleItem[] = DEFAULT_MODULES;
  try {
    const raw = t.raw("modules") as ModuleItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      modules = raw;
    }
  } catch {
    modules = DEFAULT_MODULES;
  }

  let getItems: GetItem[] = DEFAULT_WHAT_YOU_GET;
  try {
    const raw = t.raw("whatYouGetItems") as GetItem[];
    if (Array.isArray(raw) && raw.length > 0) {
      getItems = raw;
    }
  } catch {
    getItems = DEFAULT_WHAT_YOU_GET;
  }

  return (
    <section
      className="bg-fd-parchment border-b border-fd-stone py-20 lg:py-24 text-fd-body"
      id="course"
    >
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            titleClassName="text-fd-navy!"
            lead={t("lead")}
            className="mb-0"
          />
          <figure className="m-0">
            <img
              src="/images/foundations/clinicians_edge_desk.jpg"
              alt="Research, audit and quality improvement at a clinician's desk"
              className="rounded-md aspect-[16/11] object-cover w-full shadow-[0_24px_50px_rgba(20,40,75,0.22)]"
            />
          </figure>
        </div>

        {/* 8 Practical Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 mt-11">
          {modules.map((m, idx) => (
            <article
              key={idx}
              className="grid grid-cols-[56px_1fr] gap-4 bg-white border border-fd-stone rounded-md p-6"
            >
              <span className="font-serif text-[38px] text-fd-gold leading-none font-medium select-none">
                {m.num}
              </span>
              <div>
                <h3 className="font-serif text-[19px] font-semibold text-fd-navy! mb-2 leading-[1.25]">
                  {m.title}
                </h3>
                <p className="text-[15px] text-fd-body leading-[1.55] mb-0">
                  {m.description}
                </p>
                <small className="block mt-2.5 text-[13px] text-fd-gold font-semibold leading-[1.4]">
                  {m.small}
                </small>
              </div>
            </article>
          ))}
        </div>

        {/* What You Get Breakdown */}
        <h3 className="mt-11 font-serif text-[22px] font-semibold text-fd-navy!">
          {t("whatYouGetTitle")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5 mt-4.5">
          {getItems.map((item, idx) => (
            <div key={idx} className="border-t-2 border-fd-gold pt-3.5">
              <b className="block font-serif text-[19px] font-semibold text-fd-navy mb-1.5 leading-[1.3]">
                {item.title}
              </b>
              <span className="block text-[14.5px] text-fd-body leading-[1.5]">
                {item.description}
              </span>
            </div>
          ))}
        </div>

        {/* Course CTAs */}
        <div className="flex flex-wrap items-center gap-3.5 mt-9">
          <a
            className="inline-block font-sans font-semibold text-[15px] px-6 py-3.5 rounded border-[1.5px] border-fd-navy bg-fd-navy text-white hover:bg-fd-navy-deep transition-colors cursor-pointer text-center"
            href="#waitlist"
          >
            {t("joinWaitlist")}
          </a>
          <Link
            className="inline-block font-sans font-semibold text-[15px] px-6 py-3.5 rounded border-[1.5px] border-fd-navy bg-transparent text-fd-navy hover:bg-fd-navy hover:text-white transition-colors cursor-pointer text-center"
            href={`/${locale}/programmes/clinicians-edge`}
          >
            {t("brochure")}
          </Link>
        </div>
      </div>
    </section>
  );
}
