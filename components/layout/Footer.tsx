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
  return <footer className="border-t border-white/10 bg-ink text-white"><Container className="py-20 lg:py-28">
    <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,1.35fr)_minmax(180px,.8fr)_minmax(180px,.8fr)] md:gap-10 lg:gap-20">
      <div className="max-w-sm"><Link href={`/${locale}`} className="inline-flex items-center gap-3" aria-label={t("medlex")}><Image src="/images/medlex-mark.svg" alt="" width={42} height={30} priority /><span><span className="block font-display text-xl tracking-[0.08em] text-paper">MEDLEX</span><span className="mt-0.5 block font-body text-[8px] font-semibold uppercase tracking-[0.11em] text-white/65">Forensic & Medicolegal Psychiatry</span></span></Link><p className="mt-6 font-body text-[15px] leading-7 text-white/70">{t("description")}</p><a href="tel:+201019515321" className="mt-4 inline-flex font-body text-sm text-white/70">+20 101 951 5321</a></div>
      <nav aria-label={t("pathways")} className="flex flex-col items-start gap-3"><h2 className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{t("pathways")}</h2>{PATHWAY_LINKS.map((link)=><Link key={link.href} href={`/${locale}${link.href}`} className="w-fit font-body text-sm leading-6 text-white/70 hover:text-paper">{t(link.key)}</Link>)}</nav>
      <nav aria-label={t("medlex")} className="flex flex-col items-start gap-3"><h2 className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{t("medlex")}</h2>{MEDLEX_LINKS.map((link)=><Link key={link.href} href={`/${locale}${link.href}`} className="w-fit font-body text-sm leading-6 text-white/70 hover:text-paper">{t(link.key)}</Link>)}</nav>
    </div><div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/15 pt-7 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65 sm:flex-row sm:items-center"><p>MedLex Solutions · Forensic & Medicolegal Psychiatry</p><p>{t("disclaimer")}</p></div>
  </Container></footer>;
}
