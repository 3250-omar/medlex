"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarDays, Play } from "lucide-react";
import Counter from "@/components/Counter";
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
  type EnrolledCourse,
} from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ExamCountdown({
  examDate,
  course,
  isLoading,
  now,
}: {
  examDate: string;
  course: EnrolledCourse | null | undefined;
  isLoading: boolean;
  now: number;
}) {
  const t = useTranslations("exam");
  const locale = useLocale();
  const examTime = new Date(`${examDate}T00:00:00`).getTime();
  const isExamDay = now >= examTime;
  const remainingSeconds = Math.max(0, Math.floor((examTime - now) / 1_000));
  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);
  const seconds = remainingSeconds % 60;
  const resumeUnit = course?.currentUnitSlug ?? course?.firstUnitSlug;
  const formattedExamDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${examDate}T00:00:00`));


  const getCountdownLabel = (
    key: "daysShort" | "hoursShort" | "minutesShort" | "secondsShort",
    fallback: string,
  ) => (t.has(key) ? t(key) : fallback);

  const countdownUnits = [
    { value: days, label: getCountdownLabel("daysShort", "days") },
    { value: hours, label: getCountdownLabel("hoursShort", "hrs") },
    { value: minutes, label: getCountdownLabel("minutesShort", "min") },
    { value: seconds, label: getCountdownLabel("secondsShort", "sec") },
  ];

  return (
    <section
      aria-label={t("title")}
      className="border-b border-signal/25 bg-ink/95 text-white backdrop-blur-md"
    >
      <div
        className="mx-auto flex min-h-[72px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2 sm:px-8 lg:flex-nowrap lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="flex shrink-0 items-center gap-3 rounded-lg border border-signal/45 bg-signal/[0.08] px-3 py-1.5 shadow-[0_0_24px_rgba(221,178,91,0.08)]">
          <CalendarDays className="size-4 text-signal" aria-hidden="true" />
          {isExamDay ? (
            <p className="whitespace-nowrap px-1 text-sm font-semibold text-signal sm:text-base">
              {t("today")} — {locale === "ar" ? "\u0628\u0627\u0644\u062a\u0648\u0641\u064a\u0642" : "Good luck"}
            </p>
          ) : (
            <>
              <div className="flex items-center overflow-hidden rounded-sm border border-white/10 bg-ink/40" aria-hidden="true">
                {countdownUnits.map((unit) => (
                  <div key={unit.label} className="min-w-9 border-e border-white/10 px-1 text-center last:border-e-0">
                    <Counter
                      value={String(unit.value)}
                      fontSize={30}
                      padding={2}
                      gap={0}
                      horizontalPadding={0}
                      textColor="var(--signal)"
                      fontWeight="600"
                      gradientHeight={6}
                      gradientFrom="rgba(8, 22, 38, 0.95)"
                    />
                    <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>
              <span className="sr-only">{t("daysRemaining", { count: days })}</span>
            </>
          )}
          <div className="hidden border-s border-white/10 ps-4 leading-tight sm:block">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-signal">
              {t("examDateLabel")}
            </p>
            <p className="mt-0.5 text-xs text-white/65">{formattedExamDate}</p>
          </div>
        </div>
        {!isLoading && (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
            <p className="min-w-48 flex-1 text-sm leading-snug text-white/80">
              {course ? t("subscribedMessage") : t("subscribeMessage")}
            </p>
            {course ? (
              <>
                <div
                  className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-white/15 sm:block"
                  role="progressbar"
                  aria-label={t("progress", { count: course.progressPercent })}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={course.progressPercent}
                >
                  <div
                    className="h-full rounded-full bg-signal transition-[width] duration-500"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <span className="hidden text-xs font-semibold text-signal sm:inline">
                  {course.progressPercent}%
                </span>
                {resumeUnit && (
                  <Link
                    href={`/${locale}/academy/courses/${course.slug}/learn/${resumeUnit}`}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 bg-signal px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-signal-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                  >
                    <Play className="size-3.5" aria-hidden="true" />
                    {t("continueLesson")}
                  </Link>
                )}
              </>
            ) : (
              <Link
                href={`/${locale}#pathways-heading`}
                className="inline-flex min-h-9 shrink-0 items-center justify-center border border-signal px-3.5 text-xs font-semibold text-signal transition-colors hover:bg-signal hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                {t("exploreCourses")}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const alternateLocale = locale === "en" ? "ar" : "en";
  const alternateLocalePath = getLocalePath(pathname, alternateLocale);
  const isLessonPath =
    pathname.includes("/academy/courses/") && pathname.includes("/learn/");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: enrolledCourses, isLoading: coursesLoading } =
    useEnrolledCourses(Boolean(user?.examDate));
  const currentCourse = enrolledCourses?.[0] ?? null;
  const examEndTime = user?.examDate
    ? new Date(`${user.examDate}T00:00:00`).getTime() + 86_400_000
    : null;
  const shouldShowExamCountdown =
    Boolean(user?.examDate) &&
    !pathname.includes("/academy/courses/") &&
    (examEndTime === null || now < examEndTime);

  useEffect(() => {
    if (!user?.examDate) return;

    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [user?.examDate]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-h",
      shouldShowExamCountdown ? "144px" : "72px",
    );
  }, [shouldShowExamCountdown]);

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

      // void queryClient.invalidateQueries({
      //   queryKey: academyQueryKeys.currentUser,
      // });
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
          isLessonPath
            ? "relative z-50 transition-all duration-300"
            : "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || pathname.includes("/learn")
            ? "bg-ink/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            : "bg-transparent",
        ].join(" ")}
        style={{
          height: shouldShowExamCountdown ? "auto" : "var(--header-h)",
        }}
      >
        {shouldShowExamCountdown && user?.examDate && (
          <ExamCountdown
            examDate={user.examDate}
            course={coursesLoading ? undefined : currentCourse}
            isLoading={coursesLoading}
          now={now}
          />
        )}
        <div
          className="relative mx-auto flex h-[72px] items-center justify-between px-6 md:px-8 lg:px-12"
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
