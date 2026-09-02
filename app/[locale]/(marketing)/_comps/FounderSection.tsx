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
      className="bg-ink py-24 lg:py-32"
      aria-labelledby="founder-heading"
    >
      <div
        className="mx-auto grid w-full grid-cols-1 items-center gap-14 px-6 md:px-8 lg:grid-cols-[minmax(300px,.78fr)_minmax(0,1.22fr)] lg:gap-16 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <FounderPortrait
          alt={t("founder.imageAlt")}
          caption={t("founder.caption")}
        />

        <div className="max-w-3xl">
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
            {t("founder.eyebrow")}
          </span>
          <h2
            id="founder-heading"
            className="mt-7 font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
          >
            {t("founder.name")}
          </h2>
          <p className="mt-7 font-body text-lg text-signal lg:text-xl">
            {t("founder.role")}
          </p>
          <p className="mt-6 max-w-3xl font-body text-base leading-7 text-white/70 lg:text-lg lg:leading-8">
            {t("founder.bio")}
          </p>
          <Link
            href={`/${locale}/founder`}
            className="relative mt-7 inline-flex items-center gap-2 font-body text-sm text-signal after:absolute after:bottom-0 after:start-0 after:h-px after:w-0 after:bg-signal after:transition-[width] after:duration-300 hover:text-signal-light hover:after:w-full focus-visible:text-signal-light focus-visible:after:w-full"
          >
            {t("founder.profile")}
            {/* <span aria-hidden="true">Ã¢â€ â€™</span> */}
          </Link>
        </div>
      </div>
    </section>
  );
}
