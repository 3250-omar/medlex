"use client";

import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { useLocale, useTranslations } from "next-intl";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { getLocalePath } from "@/lib/i18n/localePath";
import { createClient } from "@/lib/supabase/browser";
import { apiRequest } from "@/lib/api/client";
import { showApiError } from "@/lib/api/errorToast";
import {
  academyQueryKeys,
  useCurrentUser,
} from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const alternateLocale = locale === "en" ? "ar" : "en";
  const alternateLocalePath = getLocalePath(pathname, alternateLocale);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const isProtectedPath = (path: string) => {
    const cleanPath = path.replace(/^\/(en|ar)/, "");
    return (
      cleanPath.startsWith("/courses") ||
      cleanPath.startsWith("/academy") ||
      cleanPath.startsWith("/profile")
    );
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Auth state listener ───────────────────────────────────────────── */
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        queryClient.removeQueries({ queryKey: academyQueryKeys.authenticated });
        if (isProtectedPath(pathname)) {
          router.push(`/${locale}`);
        }
        router.refresh();
      }
      void queryClient.invalidateQueries({
        queryKey: academyQueryKeys.currentUser,
      });
    });

    return () => subscription.unsubscribe();
  }, [queryClient, pathname, locale, router]);

  async function handleSignOut() {
    try {
      await apiRequest<{ signedOut: boolean }>("/api/auth/sign-out", {
        method: "POST",
      });
    } catch (error) {
      showApiError(error);
      return;
    }

    queryClient.setQueryData(academyQueryKeys.currentUser, null);
    queryClient.removeQueries({ queryKey: academyQueryKeys.authenticated });
    await queryClient.invalidateQueries({
      queryKey: academyQueryKeys.currentUser,
    });

    if (isProtectedPath(pathname)) {
      router.push(`/${locale}`);
      router.refresh();
    }
  }

  const userName = user?.fullName ?? user?.email ?? "User";
  const initials = user ? userName.charAt(0).toUpperCase() : "";

  const userMenu = user ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`${userName} - open account menu`}
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
            {userName}
          </p>
          <p className="truncate font-body text-[11px] text-white/45">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="cursor-pointer rounded-none px-3 py-2 font-body text-sm text-white/75 hover:bg-white/6 hover:text-white focus:bg-white/8 focus:text-white"
          render={
            <Link
              href={`/${locale}/profile`}
              className="flex w-full items-center gap-2"
            >
              {t("nav.profile")}
            </Link>
          }
        />

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-none px-3 py-2 font-body text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
        >
          {t("actions.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

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
          scrolled || pathname.includes("/learn")
            ? "bg-ink/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
        style={{ height: "var(--header-h)" }}
      >
        <div
          className="relative mx-auto flex h-full items-center justify-between px-6 md:px-8 lg:px-12"
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

          {/* ── Mobile user menu (centered between logo and hamburger) ── */}
          {user && (
            <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
              {userMenu}
            </div>
          )}

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
              userMenu
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
