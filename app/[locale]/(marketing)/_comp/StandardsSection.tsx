import { useTranslations } from "next-intl";

const STANDARDS = [
  {
    title: "First-mover, by construction",
    description:
      "The region's first specialised forensic psychiatry centre. We are not following a model - we are writing the one others will be measured against.",
  },
  {
    title: "UK-trained, court-tested leadership",
    description:
      "Led by a Consultant Forensic Psychiatrist whose opinion has been examined in tribunals, Magistrates' and Crown Courts, and before the Parole Board.",
  },
  {
    title: "A recognition pathway, not a certificate",
    description:
      "Academic partnerships, supervision protocols, and judicial collaboration, built in sequence toward sustainable professional accreditation.",
  },
  {
    title: "Built from live cases",
    description:
      "Every module derives from actual court requirements and real legal frameworks - the failures we teach around are ones that happened in hearings.",
  },
] as const;

export default function StandardsSection() {
  const t = useTranslations("home");
  return (
    <section
      className="bg-ink py-24 lg:py-32"
      aria-labelledby="standards-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr] lg:gap-16">
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-signal" />
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
              {t("standards.eyebrow")}
            </span>
          </div>
          <div>
            <h2
              id="standards-heading"
              className="max-w-xl font-display text-4xl leading-tight !text-paper md:text-5xl lg:text-6xl"
            >
              {t("standards.title")}
            </h2>
            <p className="mt-5 font-body text-base leading-7 text-white/70 lg:text-lg">
              {t("standards.intro")}
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-14 md:grid-cols-2 lg:ml-[244px]">
          {STANDARDS.map((standard) => (
            <article
              key={t(`standards.items.${STANDARDS.indexOf(standard)}.0`)}
              className="border-t border-white/15 py-8 first:md:pt-8"
            >
              <div className="flex gap-4">
                <span
                  className="mt-2 size-2 shrink-0 rotate-45 bg-signal"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-display text-xl leading-snug !text-paper lg:text-2xl">
                    {t(`standards.items.${STANDARDS.indexOf(standard)}.0`)}
                  </h3>
                  <p className="mt-4 max-w-lg font-body text-[15px] leading-7 text-white/70">
                    {t(`standards.items.${STANDARDS.indexOf(standard)}.1`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
