"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const NAV_ITEMS = [
  { label: "Pathways", href: "/#pathways-heading" },
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

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const targetId = href.replace(/^\/?#/, "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/${locale}#${targetId}`);
      }
    }
  };

  return (
    <nav
      className="hidden items-center gap-8 lg:flex"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item, index) => {
        const isHash = item.href.startsWith("/#") || item.href.startsWith("#");
        const targetPath = `/${locale}${item.href}`;
        const isActive =
          !isHash &&
          (pathname === targetPath || pathname.startsWith(`${targetPath}/`));
        return (
          <Link
            key={item.href}
            href={targetPath}
            onClick={(e) => handleScroll(e, item.href)}
            aria-current={isActive ? "page" : undefined}
            className={`group relative font-body text-sm tracking-wide transition-colors duration-200 hover:text-white ${isActive ? "text-signal" : "text-white/70"}`}
          >
            {labels[index]}
            <span
              className={`absolute -bottom-0.5 start-0 h-px bg-signal transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export { NAV_ITEMS };
