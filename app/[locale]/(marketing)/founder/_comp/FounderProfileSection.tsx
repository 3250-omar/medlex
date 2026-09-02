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
      className="bg-ink py-20 lg:py-28 border-b border-white/10"
      aria-labelledby="founder-profile-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(250px,280px)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          {/* Left Column: Framed Portrait with Offset Block & Key Stats */}
          <div className="mx-auto w-full max-w-[280px] lg:mx-0">
            <FounderPortrait
              alt={t("name")}
              caption={t("caption")}
              className="max-w-[280px]"
              sizes="(max-width: 1024px) 280px, 280px"
            />

            {/* Stats Bar Underneath */}
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[60px_1fr] items-center gap-4 py-4"
                >
                  <span className="font-display text-3xl font-medium text-signal">
                    {stat.value}
                  </span>
                  <p className="font-body text-xs text-white/70 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bio Narrative & Structured Pillars */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <span className="font-body text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                {t("eyebrow")}
              </span>

              {/* Main Heading */}
              <h2
                id="founder-profile-heading"
                className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white"
              >
                {t("name")}
              </h2>

              {/* Bio Narrative */}
              <div className="mt-7 space-y-5 font-body text-[15px] leading-relaxed text-white/75 sm:text-base sm:leading-8">
                <p>{t("paragraphs.0")}</p>
                <p>{t("paragraphs.1")}</p>
                <p>{t("paragraphs.2")}</p>
              </div>
            </div>

            {/* Structured Practice Details with Gold Diamonds */}
            <div className="mt-12 space-y-6 pt-6 border-t border-white/10">
              {metaItems.map((item, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 ">
                      <span
                        className="text-signal text-[11px]"
                        aria-hidden="true"
                      >
                        ◆
                      </span>
                      <p className="mt-1.5 font-body text-xs sm:text-sm leading-relaxed text-white/60 group-hover:text-white/80 transition-colors">
                        {item.value}
                      </p>
                    </div>
                    <span className="font-display text-sm tracking-wide text-white/90 italic font-medium">
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
