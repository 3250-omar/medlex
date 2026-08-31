"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useTranslations } from "next-intl";

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* {t("actions.skipToContent")} */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink focus:text-sm focus:font-body"
      >
        {t("actions.skipToContent")}
      </a>

      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-ink/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
        style={{ height: "var(--header-h)" }}
      >
        <div
          className="mx-auto flex h-full items-center justify-between px-6 md:px-8 lg:px-12"
          style={{ maxWidth: "var(--content-max)" }}
        >
          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3"
            aria-label="MedLex — home"
          >
            {/* Icon mark */}
            <span className="flex h-8 w-10 items-center justify-center border border-signal/50 transition-colors group-hover:border-signal">
              <Image src="/images/medlex-mark.svg" alt="" width={28} height={20} priority aria-hidden="true" />
            </span>

            {/* Wordmark */}
            <span className="flex flex-col leading-tight">
              <span className="font-display text-[13px] tracking-[0.2em] text-white">
                MEDLEX
              </span>
              <span className="font-body text-[8px] tracking-[0.15em] text-white/40 uppercase">
                Forensic &amp; Medicolegal Psychiatry
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────── */}
          <Navigation locale={locale} />

          {/* ── Desktop right actions ────────────────────────────── */}
          <div className="hidden items-center gap-4 lg:flex">
            <ThemeToggle />
            <Link
              href={locale === "en" ? "/ar" : "/en"}
              className="font-body text-sm tracking-[0.15em] text-white/50 transition-colors hover:text-white"
              aria-label={locale === "en" ? t("actions.switchToArabic") : t("actions.switchToEnglish")}
            >
              {t("language")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="border border-signal px-5 py-2 font-body text-sm tracking-wide text-signal transition-all duration-200 hover:bg-signal hover:text-ink"
            >
              {t("actions.register")}
            </Link>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] p-2 lg:hidden"
            aria-label={t("actions.menu")}
            aria-expanded={menuOpen}
          >
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-4 bg-white" />
            <span className="block h-px w-6 bg-white" />
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
      />
    </>
  );
}
