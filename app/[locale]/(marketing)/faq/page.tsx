import Container from "@/components/layout/Container";
import FAQAccordion from "./_comp/FAQAccordion";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { getTranslations } from "next-intl/server";

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
    <div className="min-h-screen bg-ink text-white">
      <section className="pb-24 pt-32 md:pb-32 md:pt-40">
        <Container>
          <div className="mx-auto max-w-[855px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-signal" />
              <span className="font-body text-[10px] uppercase tracking-[0.25em] text-white/60">
                {t("eyebrow")}
              </span>
            </div>
            <h1 className="mt-7 font-display text-4xl leading-[1.08] text-paper! md:text-6xl lg:text-[68px]">
              {t("title")}
            </h1>
            <p className="mt-6 font-body text-sm leading-relaxed text-white/65 md:text-base">
              {t("subtitle")}
            </p>
            <div className="mt-16 md:mt-20">
              <FAQAccordion items={items} />
            </div>
            <div className="mt-8">
              <InterestDialogTrigger className="inline-flex items-center gap-3 bg-signal px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-ink transition-all hover:bg-signal-light">
                {t("cta")} <span aria-hidden="true">→</span>
              </InterestDialogTrigger>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
