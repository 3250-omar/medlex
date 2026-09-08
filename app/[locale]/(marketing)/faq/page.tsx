import Container from "@/components/layout/Container";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { getTranslations } from "next-intl/server";
import FAQAccordion from "../_comps/FAQAccordion";

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const items = [0, 1, 2, 3].map((i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-char">
      {/* FAQ Hero Header */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-20 md:pt-44 md:pb-28 on-navy text-lbody border-b border-white/10">
        {/* Subtle decorative radial glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full px-6 sm:px-10 md:px-14 lg:px-20 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              {t("eyebrow")}
            </span>
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-serif text-4xl leading-[1.12] text-white md:text-5xl lg:text-6xl font-bold">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-lbody md:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Accordion Questions List */}
      <section className="py-20 lg:py-28 bg-[#FAF8F5] text-char">
        <div className="mx-auto w-full px-6 sm:px-10 md:px-14 lg:px-20 max-w-3xl lg:max-w-4xl">
          <FAQAccordion items={items} />

          {/* Centered CTA */}
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <InterestDialogTrigger className="btn btn-navy !py-3.5 !px-8 text-sm font-semibold gap-2.5 inline-flex items-center shadow-lg shadow-navy/15 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {t("cta")} <span aria-hidden="true" className="rtl:rotate-180">→</span>
            </InterestDialogTrigger>
          </div>
        </div>
      </section>
    </div>
  );
}
