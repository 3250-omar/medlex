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
  type GiftStatus,
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
  const hasDownloadedGift1 = giftStatus?.gift1Downloaded ?? false;
  const hasDownloadedGift2 = giftStatus?.gift2Downloaded ?? false;
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [downloadingGiftId, setDownloadingGiftId] = useState<"1" | "2" | null>(
    null,
  );

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

  const handleDownloadGift = async (giftId: "1" | "2", fileName: string) => {
    try {
      setDownloadingGiftId(giftId);
      triggerPartyAnimation();
      const response = await fetch(`/api/gifts/download?gift=${giftId}`);
      if (!response.ok) {
        throw new Error("Failed to download gift");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();

      queryClient.setQueryData<GiftStatus>(
        academyQueryKeys.giftStatus,
        (current) => ({
          gift1Downloaded: giftId === "1" || current?.gift1Downloaded === true,
          gift1DownloadedAt:
            giftId === "1"
              ? new Date().toISOString()
              : (current?.gift1DownloadedAt ?? null),
          gift2Downloaded: giftId === "2" || current?.gift2Downloaded === true,
          gift2DownloadedAt:
            giftId === "2"
              ? new Date().toISOString()
              : (current?.gift2DownloadedAt ?? null),
        }),
      );
    } catch (err) {
      console.error("Failed to download gift:", err);
    } finally {
      setDownloadingGiftId(null);
    }
  };
  const buttonClassName =
    "btn btn-gold !rounded-full !min-h-12 !px-7 font-body text-sm font-semibold text-navy inline-flex items-center justify-center transition-transform hover:-translate-y-0.5";

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
            🎉
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
          </Link>
          {[
            {
              id: "1" as const,
              fileName: "The Examiner's Briefing.pdf",
              downloaded: hasDownloadedGift1,
            },
            {
              id: "2" as const,
              fileName: "The Examiner's Error Log.pdf",
              downloaded: hasDownloadedGift2,
            },
          ]
            .filter((gift) => !gift.downloaded)
            .map((gift) => (
              <button
                key={gift.id}
                type="button"
                onClick={() => handleDownloadGift(gift.id, gift.fileName)}
                disabled={downloadingGiftId !== null}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-gold/60 bg-gold/10 px-6 font-body text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadingGiftId === gift.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Downloading {gift.fileName}...</span>
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4" />
                    <span>Download {gift.fileName}</span>
                    <Download className="h-3.5 w-3.5 opacity-80" />
                  </>
                )}
              </button>
            ))}
        </div>
      );
    }

    // Not subscribed (or not logged in): show celebratory subscribe button
    return (
      <SubscribeButton
        pathway={pathway}
        autoRedirect={false}
        onSuccess={handleSubscriptionSuccess}
        className={`${buttonClassName} group gap-2.5 shadow-lg shadow-gold/10`}
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
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy on-navy">
      {isMedicoLegal && (
        <>
          <Image
            src="/images/writing-psychiatric-evidence.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover opacity-25"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,42,73,.96),rgba(20,42,73,.80),rgba(20,42,73,.65))]" />
        </>
      )}
      <div className="mx-auto w-full px-6 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:max-w-6xl lg:px-10 lg:pb-20 lg:pt-32">
        <div className="max-w-3xl">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-normal leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
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
                <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {term}
                </dt>
                <dd className="mt-2 font-body text-sm text-white/90">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            {justSubscribed && (!hasDownloadedGift1 || !hasDownloadedGift2) && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-xs font-semibold text-gold backdrop-blur-sm">
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
