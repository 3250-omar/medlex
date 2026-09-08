import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Container from "./Container";

const PATHWAY_LINKS = [
  { key: "education", href: "/pathways/medico-legal" },
  { key: "academy", href: "/pathways/casc-academy" },
  { key: "foundations", href: "/pathways/foundations" },
] as const;
const MEDLEX_LINKS = [
  { key: "founder", href: "/founder" },
  { key: "institutional", href: "/institutional" },
  { key: "contact", href: "/contact" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
] as const;

export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  return (
    <footer className="border-t border-white/10 bg-deep text-mute">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-14 lg:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1.35fr)_minmax(180px,.8fr)_minmax(180px,.8fr)] md:gap-10 lg:gap-20">
          <div className="max-w-sm">
            <Link
              href={`/${locale}`}
              className="inline-block group"
              aria-label={t("medlex")}
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1b375c]/60 p-2.5 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-[0_0_24px_rgba(176,141,42,0.15)] max-w-[220px]">
                <Image
                  src="/images/new-logo design.jpg"
                  alt="MedLex — Forensic & Medicolegal Psychiatry"
                  width={220}
                  height={176}
                  className="h-auto w-full rounded-lg object-contain"
                />
              </div>
            </Link>
            <p className="mt-5 font-body text-[14.5px] leading-7 text-lbody">
              {t("description")}
            </p>
            <a
              href="tel:+201019515321"
              className="mt-3 inline-flex font-body text-sm text-lbody hover:text-gold transition-colors"
            >
              +20 101 951 5321
            </a>
          </div>
          <nav
            aria-label={t("pathways")}
            className="flex flex-col items-start gap-3"
          >
            <h2 className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-goldd">
              {t("pathways")}
            </h2>
            {PATHWAY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="w-fit font-body text-sm leading-6 text-lbody transition-colors hover:text-gold"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <nav
            aria-label={t("medlex")}
            className="flex flex-col items-start gap-3"
          >
            <h2 className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-goldd">
              {t("medlex")}
            </h2>
            {MEDLEX_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="w-fit font-body text-sm leading-6 text-lbody transition-colors hover:text-gold"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 font-body text-xs text-mute sm:flex-row sm:items-center">
          <p>MedLex Foundations · medlexsolutions.com</p>
          <p>{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
