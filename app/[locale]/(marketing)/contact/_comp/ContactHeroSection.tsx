import Image from "next/image";
import { useTranslations } from "next-intl";

interface ContactHeroSectionProps {
  locale: string;
}

export default function ContactHeroSection({
  locale,
}: ContactHeroSectionProps) {
  const t = useTranslations("contactPage.hero");

  return (
    <section className="relative overflow-hidden bg-ink pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 border-b border-white/10">
      {/* Background Atmosphere & Image */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Background Image on Right side */}
        <div className="absolute right-0 top-0 h-full w-full md:w-[55%] lg:w-[50%] rtl:right-auto rtl:left-0 opacity-40 md:opacity-50">
          <Image
            src="/images/dr-ahmed-abouelghit.webp"
            alt="MedLex Contact"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[center_20%] grayscale"
          />
          {/* Subtle warm/gold glow accent */}
          <div className="absolute top-0 right-0 h-72 w-72 bg-signal/10 blur-3xl pointer-events-none" />
        </div>

        {/* Directional Vignettes & Overlays for Text Contrast */}
        {/* Desktop Left-to-Right Ink Blend (LTR: Solid ink on left, smooth transition to right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 via-40% to-transparent hidden md:block rtl:hidden" />

        {/* Desktop Right-to-Left Ink Blend for RTL (Arabic) */}
        <div className="absolute inset-0 bg-gradient-to-l from-ink via-ink/95 via-40% to-transparent hidden rtl:md:block" />

        {/* Mobile solid/gradient overlay */}
        <div className="absolute inset-0 bg-ink/85 md:hidden" />

        {/* Top and bottom subtle fade */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Hero Content */}
      <div
        className="relative z-10 mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-6 shrink-0 bg-signal" aria-hidden="true" />
            <span className="font-body text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {t("eyebrow")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-normal leading-[1.12] tracking-tight text-white">
            {t("title")}
          </h1>

          {/* Intro Description */}
          <p className="mt-5 max-w-xl font-body text-sm sm:text-base leading-relaxed text-white/75 md:leading-7">
            {t("intro")}
          </p>
        </div>
      </div>
    </section>
  );
}
