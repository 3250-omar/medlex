"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { useLocale, useTranslations } from "next-intl";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { getLocalePath } from "@/lib/i18n/localePath";
import { createClient } from "@/lib/supabase/browser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AuthUser = { name: string; email: string } | null;

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const alternateLocale = locale === "en" ? "ar" : "en";
  const alternateLocalePath = getLocalePath(pathname, alternateLocale);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Auth state listener ───────────────────────────────────────────── */
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ?? session.user.email ?? "User";
        setUser({ name, email: session.user.email ?? "" });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ?? session.user.email ?? "User";
        setUser({ name, email: session.user.email ?? "" });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  const initials = user?.name?.charAt(0).toUpperCase() ?? "";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[300] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink focus:text-sm focus:font-body"
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
          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3"
            aria-label={t("brand.home")}
          >
            <span className="flex h-8 w-10 items-center justify-center border border-signal/50 transition-colors group-hover:border-signal">
              <Image
                src="/images/medlex-mark.svg"
                alt=""
                width={28}
                height={20}
                priority
                aria-hidden="true"
              />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-[13px] tracking-[0.2em] text-white">
                {t("brand.name")}
              </span>
              <span className="font-body text-[8px] tracking-[0.15em] text-white/40 uppercase">
                {t("brand.descriptor")}
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────────── */}
          <Navigation showCourses={Boolean(user)} />

          {/* ── Desktop right actions ────────────────────────────────── */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Locale switcher */}
            <Link
              href={alternateLocalePath}
              className="font-body text-sm tracking-[0.15em] text-white/50 transition-colors hover:text-white"
              aria-label={
                locale === "en"
                  ? t("actions.switchToArabic")
                  : t("actions.switchToEnglish")
              }
            >
              {t("language")}
            </Link>

            {user ? (
              /* ── Authenticated: avatar + dropdown ─────────────────── */
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      id="header-user-menu"
                      aria-label={`${user.name} — open account menu`}
                      className="flex size-9 items-center justify-center rounded-full bg-signal font-body text-sm font-semibold text-ink transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                    >
                      {initials}
                    </button>
                  }
                />

                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  sideOffset={8}
                  className="min-w-[180px] rounded-none border border-white/10 bg-ink p-1 text-sm text-white shadow-xl"
                >
                  {/* User info */}
                  <div className="px-3 py-2">
                    <p className="truncate font-body text-xs font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="truncate font-body text-[11px] text-white/45">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    id="header-profile-link"
                    className="cursor-pointer rounded-none px-3 py-2 font-body text-sm text-white/75 hover:bg-white/6 hover:text-white focus:bg-white/8 focus:text-white"
                    render={
                      <Link
                        href={`/${locale}/academy`}
                        className="flex w-full items-center gap-2"
                      >
                        Profile
                      </Link>
                    }
                  />

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    id="header-sign-out"
                    className="cursor-pointer rounded-none px-3 py-2 font-body text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                    render={
                      <button type="button" onClick={handleSignOut}>
                        Log out
                      </button>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* ── Guest: register button ───────────────────────────── */
              <InterestDialogTrigger className="border border-signal px-5 py-2 font-body text-sm tracking-wide text-signal transition-all duration-200 hover:bg-signal hover:text-ink">
                {t("actions.register")}
              </InterestDialogTrigger>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────── */}
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-label={t("actions.menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-navigation"
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
        showCourses={Boolean(user)}
        returnFocusRef={menuTriggerRef}
      />
    </>
  );
}
