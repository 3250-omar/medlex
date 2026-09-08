import Link from "next/link";
import { useTranslations } from "next-intl";
import FounderPortrait from "@/components/marketing/FounderPortrait";

interface FounderSectionProps {
  locale: string;
}

/*
  The homepage founder panel intentionally omits the previous credential list,
  three institutional metric cards, consultation CTA, and signature block.
  Those details belong on the dedicated /founder page rather than this concise profile.
*/

export default function FounderSection({ locale }: FounderSectionProps) {
  const t = useTranslations("home");
  return (
    <section
      className="bg-navy py-20 lg:py-28 on-navy text-lbody border-b border-white/10"
      aria-labelledby="founder-heading"
    >
      <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(320px,.72fr)_minmax(0,1.28fr)] lg:gap-20 xl:gap-28 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        <FounderPortrait
          alt={t("founder.imageAlt")}
          caption={t("founder.caption")}
          className="max-w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-gold/40"
        />

        <div className="max-w-4xl">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            {t("founder.eyebrow")}
          </span>
          <h2
            id="founder-heading"
            className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
          >
            {t("founder.name")}
          </h2>
          <p className="mt-4 font-serif italic text-lg sm:text-xl text-lgold">
            {t("founder.role")}
          </p>
          <p className="mt-6 max-w-3xl font-sans text-base sm:text-lg leading-relaxed text-lbody">
            {t("founder.bio")}
          </p>
          <Link
            href={`/${locale}/founder`}
            className="relative mt-8 inline-flex items-center gap-2 font-sans text-sm font-semibold text-gold after:absolute after:bottom-0 after:start-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-300 hover:text-lgold hover:after:w-full focus-visible:text-lgold focus-visible:after:w-full"
          >
            {t("founder.profile")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
