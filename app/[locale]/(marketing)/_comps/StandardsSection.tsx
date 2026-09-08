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
      className="bg-white py-20 lg:py-28 text-char border-b border-hair"
      aria-labelledby="standards-heading"
    >
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-16">
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-gold" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-goldd">
              {t("standards.eyebrow")}
            </span>
          </div>
          <div>
            <h2
              id="standards-heading"
              className="max-w-4xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] text-navy!"
            >
              {t("standards.title")}
            </h2>
            <p className="mt-5 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-char">
              {t("standards.intro")}
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {STANDARDS.map((standard, index) => (
            <article
              key={t(`standards.items.${STANDARDS.indexOf(standard)}.0`)}
              className="border-t-2 border-gold pt-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-2xl font-bold text-gold block mb-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-bold text-navy leading-snug mb-3">
                  {t(`standards.items.${STANDARDS.indexOf(standard)}.0`)}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-grey">
                  {t(`standards.items.${STANDARDS.indexOf(standard)}.1`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
