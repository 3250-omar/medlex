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
    <section className="relative overflow-hidden bg-navy pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 border-b border-white/10 on-navy text-lbody">
      {/* Background Atmosphere & Image */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Background Image on Right side */}
        <div className="absolute right-0 top-0 h-full w-full md:w-[65%] lg:w-[58%] rtl:right-auto rtl:left-0 opacity-40 md:opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,black_45%,black_100%)] rtl:[mask-image:linear-gradient(to_left,transparent_0%,black_45%,black_100%)]">
          <Image
            src="/images/dr-ahmed-abouelghit.webp"
            alt="MedLex Contact"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover object-[center_20%] grayscale"
          />
          {/* Subtle warm/gold glow accent */}
          <div className="absolute top-0 right-0 h-72 w-72 bg-gold/10 blur-3xl pointer-events-none" />
        </div>

        {/* Directional Vignettes & Overlays for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 via-50% to-transparent hidden md:block rtl:hidden" />
        <div className="absolute inset-0 bg-gradient-to-l from-navy via-navy/95 via-50% to-transparent hidden rtl:md:block" />
        <div className="absolute inset-0 bg-navy/85 md:hidden" />

        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-navy to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-7 shrink-0 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {t("eyebrow")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-6 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-white">
            {t("title")}
          </h1>

          {/* Intro Description */}
          <p className="mt-5 max-w-xl font-sans text-base sm:text-lg leading-relaxed text-lbody md:leading-8">
            {t("intro")}
          </p>
        </div>
      </div>
    </section>
  );
}
