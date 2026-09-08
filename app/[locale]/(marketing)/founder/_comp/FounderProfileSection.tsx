import { useTranslations } from "next-intl";
import FounderPortrait from "@/components/marketing/FounderPortrait";

interface FounderProfileSectionProps {
  locale: string;
}

export default function FounderProfileSection({
  locale,
}: FounderProfileSectionProps) {
  const t = useTranslations("founderPage.profile");

  const stats = [
    { value: t("stats.0.value"), label: t("stats.0.label") },
    { value: t("stats.1.value"), label: t("stats.1.label") },
  ];

  const metaItems = [
    { label: t("meta.0.label"), value: t("meta.0.value") },
    { label: t("meta.1.label"), value: t("meta.1.value") },
    { label: t("meta.2.label"), value: t("meta.2.value") },
    { label: t("meta.3.label"), value: t("meta.3.value") },
  ];

  return (
    <section
      className="bg-white py-20 lg:py-28 text-char border-b border-hair"
      aria-labelledby="founder-profile-heading"
    >
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          {/* Left Column: Framed Portrait with Key Stats */}
          <div className="mx-auto w-full max-w-[320px] lg:mx-0">
            <FounderPortrait
              alt={t("name")}
              caption={t("caption")}
              className="max-w-[320px] rounded-2xl overflow-hidden shadow-xl border border-hair"
              sizes="(max-width: 1024px) 320px, 320px"
            />

            {/* Stats Bar Underneath */}
            <div className="mt-8 divide-y divide-hair border-y border-hair">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[70px_1fr] items-center gap-4 py-4"
                >
                  <span className="font-serif text-3xl font-bold text-gold">
                    {stat.value}
                  </span>
                  <p className="font-sans text-xs text-grey leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bio Narrative & Structured Pillars */}
          <div className="flex flex-col justify-between max-w-4xl">
            <div>
              {/* Eyebrow */}
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-goldd">
                {t("eyebrow")}
              </span>

              {/* Main Heading */}
              <h2
                id="founder-profile-heading"
                className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy!"
              >
                {t("name")}
              </h2>

              {/* Bio Narrative */}
              <div className="mt-7 space-y-5 font-sans text-[16px] leading-[1.75] text-char">
                <p>{t("paragraphs.0")}</p>
                <p>{t("paragraphs.1")}</p>
                <p>{t("paragraphs.2")}</p>
              </div>
            </div>

            {/* Structured Practice Details with Gold Diamonds */}
            <div className="mt-12 space-y-4 pt-6 border-t border-hair">
              {metaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-hair bg-tint/40 p-4 transition-colors hover:border-gold/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-gold text-[11px]"
                        aria-hidden="true"
                      >
                        ◆
                      </span>
                      <p className="font-sans text-xs sm:text-sm font-medium text-char">
                        {item.value}
                      </p>
                    </div>
                    <span className="font-serif text-sm tracking-wide text-navy italic font-semibold sm:text-end shrink-0">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
