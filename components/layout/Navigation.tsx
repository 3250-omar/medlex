"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { label: "Pathways", href: "/pathways" },
  { label: "Founder", href: "/founder" },
  { label: "FAQ", href: "/#faq" },
  { label: "Institutional", href: "/institutional" },
  { label: "Contact", href: "/contact" },
] as const;

interface NavigationProps { locale: string; }

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations();
  const labels = [t("nav.pathways"), t("nav.founder"), t("nav.faq"), t("nav.institutional"), t("nav.contact")];

  return (
    <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
      {NAV_ITEMS.map((item, index) => (
        <Link key={item.href} href={`/${locale}${item.href}`} className="group relative font-body text-sm tracking-wide text-white/70 transition-colors duration-200 hover:text-white">
          {labels[index]}
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
}

export { NAV_ITEMS };