"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  useEnrolledCourses,
} from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import { UserAccountMenu, ExamCountdown } from "./_comp/header";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  console.log("🚀 ~ Header ~ pathname:", pathname.includes("/casc-academy"));
  const alternateLocale = locale === "en" ? "ar" : "en";
  const alternateLocalePath = getLocalePath(pathname, alternateLocale);
  const isLessonPath =
    pathname.includes("/academy/courses/") && pathname.includes("/learn/");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [countdownH, setCountdownH] = useState(72);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const countdownRef = useRef<HTMLElement>(null);
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: enrolledCourses, isLoading: coursesLoading } =
    useEnrolledCourses(Boolean(user));
  const currentCourse = enrolledCourses?.[0] ?? null;
  const hasCourses = (enrolledCourses?.length ?? 0) > 0;
  const showCourses = Boolean(user) && hasCourses;
  const examEndTime = user?.examDate
    ? new Date(`${user.examDate}T00:00:00`).getTime() + 86_400_000
    : null;
  const shouldShowExamCountdown =
    Boolean(user?.examDate) &&
    !pathname.includes("/academy/courses/") &&
    (examEndTime === null || now < examEndTime) &&
    !pathname.includes("/academy/preview");

  useEffect(() => {
    if (!shouldShowExamCountdown) return;
    const el = countdownRef.current;
    if (!el) return;

    const updateH = () => {
      if (countdownRef.current) {
        const h = countdownRef.current.offsetHeight;
        if (h > 0) {
          setCountdownH((prev) => (prev !== h ? h : prev));
        }
      }
    };

    updateH();
    const ro = new ResizeObserver(updateH);
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [shouldShowExamCountdown]);

  useEffect(() => {
    const totalH = shouldShowExamCountdown ? 72 + countdownH : 72;
    document.documentElement.style.setProperty("--header-h", `${totalH}px`);
  }, [shouldShowExamCountdown, countdownH]);

  const isProtectedPath = useCallback((path: string) => {
    const cleanPath = path.replace(/^\/(en|ar)/, "");
    if (cleanPath.startsWith("/academy/preview")) return false;
    return (
      cleanPath.startsWith("/courses") ||
      cleanPath.startsWith("/academy") ||
      cleanPath.startsWith("/profile")
    );
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
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
    });

    return () => subscription.unsubscribe();
  }, [queryClient, pathname, locale, router, isProtectedPath]);

  const handleSignOut = useCallback(async () => {
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
  }, [queryClient, pathname, locale, router, isProtectedPath]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[300] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink focus:text-sm focus:font-body"
      >
        {t("actions.skipToContent")}
      </a>

      <header
        ref={headerRef}
        className={[
          isLessonPath
            ? "relative z-50 transition-all duration-300"
            : "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || pathname.includes("/learn")
            ? "bg-navy/95 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
            : "bg-navy/90 backdrop-blur-md border-b border-white/[0.08]",
        ].join(" ")}
        style={{
          height: shouldShowExamCountdown ? "auto" : "72px",
        }}
      >
        {shouldShowExamCountdown && user?.examDate && (
          <ExamCountdown
            containerRef={countdownRef}
            examDate={user.examDate}
            course={coursesLoading ? undefined : currentCourse}
            isLoading={coursesLoading}
          />
        )}
        <div className="relative mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          {/* ── Logo ─────────────────────────────────────────────────── */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3"
            aria-label={t("brand.home")}
          >
            <span className="flex h-8 w-11 items-center justify-center overflow-hidden border border-gold/50 bg-[#1b375c]/60 p-0.5 transition-colors group-hover:border-gold">
              <Image
                src="/images/new-emblem.png"
                alt=""
                width={36}
                height={20}
                className="h-auto w-auto object-contain"
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
              <UserAccountMenu
                user={user}
                locale={locale}
                onSignOut={handleSignOut}
                profileLabel={t("nav.profile")}
                logoutLabel={t("actions.logout")}
              />
            </div>
          )}

          {/* ── Desktop nav ──────────────────────────────────────────── */}
          <Navigation showCourses={showCourses} />

          {/* ── Desktop right actions ────────────────────────────────── */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Locale switcher */}
            {pathname.includes("/casc-academy") ? null : (
              <Link
                href={alternateLocalePath}
                className="font-body text-sm tracking-[0.15em] text-lbody transition-colors hover:text-white"
                aria-label={
                  locale === "en"
                    ? t("actions.switchToArabic")
                    : t("actions.switchToEnglish")
                }
              >
                {t("language")}
              </Link>
            )}

            {user ? (
              <UserAccountMenu
                user={user}
                locale={locale}
                onSignOut={handleSignOut}
                profileLabel={t("nav.profile")}
                logoutLabel={t("actions.logout")}
              />
            ) : (
              /* ── Guest: register button ───────────────────────────── */
              <InterestDialogTrigger className="btn btn-gold !h-9 !py-1 !px-5 text-sm font-semibold">
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

      {shouldShowExamCountdown && !isLessonPath && (
        <div
          style={{ height: `${countdownH}px` }}
          aria-hidden="true"
          className="w-full shrink-0 pointer-events-none"
        />
      )}

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        showCourses={showCourses}
        returnFocusRef={menuTriggerRef}
      />
    </>
  );
}
