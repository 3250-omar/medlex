import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
        <figure className="relative mx-auto w-full max-w-[330px] lg:mx-0">
          <div
            className="absolute inset-y-4 -right-5 -z-0 w-full bg-signal/15"
            aria-hidden="true"
          />
          <div className="relative z-10 aspect-[4/5] overflow-hidden border border-white/10 bg-accent">
            <Image
              src="/images/dr-ahmed-abouelghit.webp"
              alt={t("founder.imageAlt")}
              fill
              sizes="(max-width: 1024px) min(88vw, 330px), 330px"
              className="object-cover object-top"
            />
            <span
              className="absolute right-4 top-4 grid size-13 place-items-center rounded-full border border-white/45 bg-ink/30 font-body text-[9px] leading-3 text-white backdrop-blur-sm"
              aria-hidden="true"
            >
              MED
              <br />
              LEX
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent px-5 pb-5 pt-16 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
              {t("founder.caption")}
            </figcaption>
          </div>
        </figure>

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
            className="relative mt-7 inline-flex items-center gap-2 font-body text-sm text-signal after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-signal after:transition-[width] after:duration-300 hover:text-signal-light hover:after:w-full focus-visible:text-signal-light focus-visible:after:w-full"
          >
            {t("founder.profile")}
            {/* <span aria-hidden="true">Ã¢â€ â€™</span> */}
          </Link>
        </div>
      </div>
    </section>
  );
}
