"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import confetti from "canvas-confetti";
import { Gift, Download, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Eyebrow from "./Eyebrow";
import SubscribeButton from "./SubscribeButton";
import {
  academyQueryKeys,
  useCurrentUser,
  useEnrolledCourses,
  useGiftStatus,
} from "../../_apiCalls/academyQueries";
import {
  type PathwayContent,
  type PathwayKey,
  type PathwayLabels,
} from "./pathwayContent";

interface PathwayHeroSectionProps {
  pathway: PathwayKey;
  content: PathwayContent;
  labels: PathwayLabels;
}

export default function PathwayHeroSection({
  pathway,
  content,
  labels,
}: PathwayHeroSectionProps) {
  const locale = useLocale();
  const isMedicoLegal = pathway === "medico-legal";
  const isCascAcademy = pathway === "casc-academy";

  const { data: user } = useCurrentUser();
  const { data: enrolledCourses } = useEnrolledCourses(Boolean(user));
  const { data: giftStatus } = useGiftStatus(Boolean(user));
  const queryClient = useQueryClient();

  const enrolledCourse = enrolledCourses?.find((c) => c.slug === pathway);

  const isSubscribed = !!enrolledCourse;
  // Hide gift button if the user already downloaded before this session
  const hasDownloadedGift = giftStatus?.giftDownloaded ?? false;
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [isDownloadingGift, setIsDownloadingGift] = useState(false);

  const triggerPartyAnimation = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      zIndex: 99999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const handleSubscriptionSuccess = useCallback(() => {
    setJustSubscribed(true);
    triggerPartyAnimation();
  }, [triggerPartyAnimation]);

  const handleDownloadGift = async () => {
    try {
      setIsDownloadingGift(true);
      triggerPartyAnimation();
      const response = await fetch("/api/gifts/download");
      if (!response.ok) {
        throw new Error("Failed to download gift");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Twelve Weeks to the CASC.pdf";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
      queryClient.setQueryData(academyQueryKeys.giftStatus, {
        giftDownloaded: true,
        giftDownloadedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to download gift:", err);
    } finally {
      setIsDownloadingGift(false);
    }
  };

  const buttonClassName =
    "inline-flex min-h-12 items-center justify-center bg-signal px-6 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal";

  function renderHeroButton() {
    if (!isCascAcademy) {
      // Foundations & medico-legal are not available yet
      return (
        <button
          type="button"
          disabled
          className={`${buttonClassName} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Coming soon
          <span className="ms-3" aria-hidden="true">
            →
          </span>
        </button>
      );
    }

    if (isSubscribed || justSubscribed) {
      // Logged in + subscribed: link directly to the course and display gift button beside it
      const firstUnit = enrolledCourse?.firstUnitSlug ?? "start-here";
      return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/${locale}/academy/courses/${pathway}/learn/${firstUnit}`}
            className={buttonClassName}
          >
            Go to the course
            <span className="ms-3" aria-hidden="true">
              →
            </span>
          </Link>
          {!hasDownloadedGift && (
            <button
              type="button"
              onClick={handleDownloadGift}
              disabled={isDownloadingGift}
              className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-signal/50 bg-signal/15 px-6 font-body text-sm font-semibold text-signal transition-all hover:border-signal hover:bg-signal hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloadingGift ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Downloading gift...</span>
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4" />
                  <span>Get your gift now</span>
                  <Download className="h-3.5 w-3.5 opacity-80" />
                </>
              )}
            </button>
          )}
        </div>
      );
    }

    // Not subscribed (or not logged in): show celebratory subscribe button
    return (
      <SubscribeButton
        pathway={pathway}
        autoRedirect={false}
        onSuccess={handleSubscriptionSuccess}
        className={`${buttonClassName} group gap-2.5 shadow-lg shadow-signal/20`}
        showArrow={false}
      >
        <span>Subscribe to get your gift</span>
        <span
          className="text-base transition-transform duration-300 group-hover:scale-125"
          role="img"
          aria-label="party"
        >
          🎉
        </span>
      </SubscribeButton>
    );
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      {isMedicoLegal && (
        <>
          <Image
            src="/images/writing-psychiatric-evidence.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,24,42,.97),rgba(7,24,42,.75),rgba(7,24,42,.58))]" />
        </>
      )}
      <div className="mx-auto w-full px-6 pb-14 pt-20 sm:px-8 sm:pb-16 sm:pt-22 lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-24">
        <div className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="mt-7 max-w-3xl font-display text-4xl leading-[1.04] text-white sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base leading-7 text-white/65 sm:text-lg">
            {content.intro}
          </p>
          <dl className="mt-9 grid max-w-3xl gap-5 border-t border-white/15 pt-6 sm:grid-cols-3">
            {[
              [labels.delivery || "Delivery", content.delivery],
              [labels.languages || "Languages", content.languages],
              [labels.status || "Status", content.status],
            ].map(([term, detail]) => (
              <div
                key={term}
                className="border-s border-white/10 ps-4 first:border-s-0 first:ps-0"
              >
                <dt className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {term}
                </dt>
                <dd className="mt-2 font-body text-sm text-white/85">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            {justSubscribed && !hasDownloadedGift && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-semibold text-signal backdrop-blur-sm">
                <span className="text-sm">🎉</span>
                <span>
                  You are officially enrolled! Download your gift below.
                </span>
              </div>
            )}
            {renderHeroButton()}
          </div>
        </div>
      </div>
    </section>
  );
}
