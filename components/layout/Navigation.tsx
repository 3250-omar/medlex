"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const NAV_ITEMS = [
  { label: "Pathways", href: "/pathways" },
  { label: "Founder", href: "/founder" },
  { label: "FAQ", href: "/faq" },
  { label: "Institutional", href: "/institutional" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navigation() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations();
  const labels = [
    t("nav.pathways"),
    t("nav.founder"),
    t("nav.faq"),
    t("nav.institutional"),
    t("nav.contact"),
  ];

  return (
    <nav
      className="hidden items-center gap-8 lg:flex"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item, index) => {
        const targetPath = `/${locale}${item.href.replace("/#", "")}`;
        const isActive =
          pathname === targetPath || pathname.startsWith(`${targetPath}/`);
        return (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            aria-current={isActive ? "page" : undefined}
            className={`group relative font-body text-sm tracking-wide transition-colors duration-200 hover:text-white ${isActive ? "text-signal" : "text-white/70"}`}
          >
            {labels[index]}
            <span
              className={`absolute -bottom-0.5 left-0 h-px bg-signal transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export { NAV_ITEMS };
