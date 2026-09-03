"use client";

import { type RefObject, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./Navigation";
import { useLocale, useTranslations } from "next-intl";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { getLocalePath } from "@/lib/i18n/localePath";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  locale: string;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  showCourses?: boolean;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function MobileMenu({
  open,
  onClose,
  returnFocusRef,
  showCourses = false,
}: MobileMenuProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const alternateLocale = locale === "en" ? "ar" : "en";
  const alternateLocalePath = getLocalePath(pathname, alternateLocale);
  const t = useTranslations();
  const labels = [
    t("nav.pathways"),
    t("nav.founder"),
    t("nav.faq"),
    t("nav.institutional"),
    t("nav.contact"),
  ];
  const items = showCourses
    ? [...NAV_ITEMS, { label: "Courses", href: "/courses" }]
    : NAV_ITEMS;
  const panelRef = useRef<HTMLDivElement>(null);

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const menuTrigger = returnFocusRef.current;
    const focusableElements = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    const initialFocus = focusableElements[0];
    initialFocus?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab" || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      menuTrigger?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* slide-in panel */}
      <div
        ref={panelRef}
        className="relative ms-auto flex h-full w-full max-w-sm flex-col bg-ink px-8 py-8"
      >
        {/* close */}
        <button
          onClick={onClose}
          className="mb-12 flex min-h-11 min-w-11 items-center justify-center self-end text-white/50 transition-colors hover:text-white"
          aria-label={t("actions.close")}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* nav links */}
        <nav className="flex flex-col gap-7" aria-label="Mobile navigation">
          {items.map((item, index) => {
            const isHash =
              item.href.startsWith("/#") || item.href.startsWith("#");
            const targetPath = `/${locale}${item.href}`;
            return (
              <Link
                key={item.href}
                href={targetPath}
                onClick={(e) => {
                  onClose();
                  if (isHash) {
                    const targetId = item.href.replace(/^\/?#/, "");
                    const elem = document.getElementById(targetId);
                    if (elem) {
                      e.preventDefault();
                      elem.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(
                        null,
                        "",
                        `/${locale}#${targetId}`,
                      );
                    }
                  }
                }}
                className="font-display text-2xl text-white/80 tracking-wide transition-colors hover:text-white"
              >
                {item.label === "Courses" ? t("nav.courses") : labels[index]}
              </Link>
            );
          })}
        </nav>

        {/* bottom actions */}
        <div className="mt-auto flex flex-col gap-4">
          <Link
            href={alternateLocalePath}
            onClick={onClose}
            className="font-body text-sm text-white/40 tracking-[0.15em] transition-colors hover:text-white/70"
          >
            {t("language")}
          </Link>
          <InterestDialogTrigger className="border border-signal py-3 text-center font-body text-sm tracking-wide text-signal transition-all hover:bg-signal hover:text-ink">
            {t("actions.register")}
          </InterestDialogTrigger>
        </div>
      </div>
    </div>
  );
}
