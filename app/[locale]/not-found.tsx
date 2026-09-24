import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy on-navy px-6 text-center text-lbody">
      <div className="h-px w-16 bg-gold/50" />
      <div>
        <p className="kicker text-gold mb-3">
          {t("kicker")}
        </p>
        <h1 className="font-serif text-4xl font-normal text-white sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-lbody max-w-sm mx-auto">
          {t("description")}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/${locale}`}
          className="btn btn-gold !rounded-full !px-8 !py-3.5 text-sm font-semibold text-navy inline-flex items-center justify-center"
        >
          {t("returnHome")}
        </Link>
        <Link
          href={`/${locale}/pathways`}
          className="btn btn-ghost !rounded-full !px-8 !py-3.5 text-sm font-semibold text-white inline-flex items-center justify-center"
        >
          {t("viewPathways")}
        </Link>
      </div>
    </div>
  );
}
