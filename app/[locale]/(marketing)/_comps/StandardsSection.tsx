import { useTranslations } from "next-intl";

const STANDARDS = [0, 1, 2, 3] as const;

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
              className="max-w-4xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] !text-navy"
            >
              {t("standards.title")}
            </h2>
            <p className="mt-5 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-char">
              {t("standards.intro")}
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {STANDARDS.map((index) => (
            <article
              key={index}
              className="border-t-2 border-gold pt-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-2xl font-bold text-gold block mb-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-bold !text-navy leading-snug mb-3">
                  {t(`standards.items.${index}.0`)}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-grey">
                  {t(`standards.items.${index}.1`)}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hair font-sans text-xs font-semibold uppercase tracking-wider text-goldd">
                {t(`standards.items.${index}.2`)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
