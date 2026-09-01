"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "./Navigation";
import { useLocale, useTranslations } from "next-intl";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  locale: string;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const locale = useLocale();
  const t = useTranslations();
  const labels = [
    t("nav.pathways"),
    t("nav.founder"),
    t("nav.faq"),
    t("nav.institutional"),
    t("nav.contact"),
  ];
  const panelRef = useRef<HTMLDivElement>(null);

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* trap focus and handle Escape */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

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
        className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-ink px-8 py-8"
      >
        {/* close */}
        <button
          onClick={onClose}
          className="mb-12 self-end p-2 text-white/50 transition-colors hover:text-white"
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
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={onClose}
              className="font-display text-2xl text-white/80 tracking-wide transition-colors hover:text-white"
            >
              {labels[index]}
            </Link>
          ))}
        </nav>

        {/* bottom actions */}
        <div className="mt-auto flex flex-col gap-4">
          <ThemeToggle />
          <Link
            href={locale === "en" ? "/ar" : "/en"}
            onClick={onClose}
            className="font-body text-sm text-white/40 tracking-[0.15em] transition-colors hover:text-white/70"
          >
            {t("language")}
          </Link>
          <InterestDialogTrigger className="border border-signal py-3 text-center font-body text-sm tracking-wide text-signal transition-all hover:bg-signal hover:text-ink">{t("actions.register")}</InterestDialogTrigger>
        </div>
      </div>
    </div>
  );
}
