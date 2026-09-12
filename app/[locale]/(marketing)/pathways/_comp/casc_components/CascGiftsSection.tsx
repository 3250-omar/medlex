"use client";

import Image from "next/image";
import { useCallback, useContext, useState } from "react";
import { Download, Gift, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useQueryClient } from "@tanstack/react-query";
import { InterestDialogContext } from "@/components/marketing/InterestDialog";
import {
  academyQueryKeys,
  type GiftStatus,
  useCurrentUser,
  useGiftStatus,
} from "../../../_apiCalls/academyQueries";

export default function CascGiftsSection() {
  const dialog = useContext(InterestDialogContext);
  const { data: user } = useCurrentUser();
  const { data: giftStatus } = useGiftStatus(Boolean(user));
  const queryClient = useQueryClient();
  const [downloading, setDownloading] = useState<"1" | "2" | null>(null);
  const [downloadError, setDownloadError] = useState(false);

  const triggerCelebration = useCallback(() => {
    const count = 200;
    const defaults = { origin: { y: 0.65 }, zIndex: 99999 };

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

  async function downloadGift(id: "1" | "2", fileName: string) {
    if (!user) {
      dialog?.openInterestDialog("casc-academy", "register", () => {
        void downloadGift(id, fileName);
      });
      return;
    }

    setDownloading(id);
    try {
      const response = await fetch(`/api/gifts/download?gift=${id}`);
      if (!response.ok) throw new Error("Gift download failed");
      const cleanFileName =
        fileName
          .replace(/(\s*-\s*downloaded.*)+/gi, "")
          .replace(/\.pdf$/i, "") + ".pdf";
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = cleanFileName;
      anchor.click();
      URL.revokeObjectURL(url);
      triggerCelebration();
      queryClient.setQueryData<GiftStatus>(
        academyQueryKeys.giftStatus,
        (current) => ({
          gift1Downloaded: id === "1" || current?.gift1Downloaded === true,
          gift1DownloadedAt:
            id === "1"
              ? new Date().toISOString()
              : (current?.gift1DownloadedAt ?? null),
          gift2Downloaded: id === "2" || current?.gift2Downloaded === true,
          gift2DownloadedAt:
            id === "2"
              ? new Date().toISOString()
              : (current?.gift2DownloadedAt ?? null),
        }),
      );
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <section
      id="gifts"
      className="relative py-20 lg:py-24 border-b border-hair bg-tint text-char on-tint overflow-hidden"
    >
      {/* Background image with suitable opacity */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <Image
          src="/images/sectionImages/gift_section.jpg"
          alt="The Examiner's Briefing and Error Log preparation resources"
          fill
          className="object-cover object-center opacity-100"
          sizes="100vw"
        />
        {/* Soft tint gradient overlays to ensure text legibility while revealing the desk and gift booklets */}
        <div className="absolute inset-0 bg-gradient-to-r from-tint/95 via-tint/70 to-tint/60" />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-tint/70 via-transparent to-tint/40" /> */}
      </div>

      <div className="relative z-10 mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="kicker text-goldd">Before you enrol</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
            Two things from the examiner&apos;s chair, free.
          </h2>
          <p className="mt-4 font-serif text-lg sm:text-xl text-char leading-relaxed">
            Download both practical CASC resources straight away. No card, no
            commitment.
          </p>

          <ul className="mt-8 list-none p-0 divide-y divide-hair">
            <li className="grid grid-cols-[44px_1fr] gap-4 py-4 items-center">
              <div
                className="w-11 h-14 bg-navy rounded border-b-4 border-gold shrink-0"
                aria-hidden="true"
              />
              <div>
                <b className="font-serif text-lg font-semibold text-navy! block">
                  The Examiner&apos;s Briefing
                </b>
                <span className="text-sm text-grey leading-relaxed">
                  How the CASC is actually marked, the errors examiners see
                  most, and the grammar of a British consultation — thirteen
                  pages, from the other side of the table.
                </span>
              </div>
            </li>
            <li className="grid grid-cols-[44px_1fr] gap-4 py-4 items-center">
              <div
                className="w-11 h-14 bg-navy rounded border-b-4 border-gold shrink-0"
                aria-hidden="true"
              />
              <div>
                <b className="font-serif text-lg font-semibold text-navy! block">
                  The Examiner&apos;s Error Log
                </b>
                <span className="text-sm text-grey leading-relaxed">
                  A one-page self-audit you fill in after every practice
                  station, so the person watching you can tick what they saw.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Card: Two Gifts Buttons */}
        <div className="bg-white/95 backdrop-blur-xs border border-hair rounded-2xl p-7 sm:p-9 shadow-md">
          <h3 className="font-serif text-2xl font-bold text-navy! mb-2">
            Download Both
          </h3>
          <p className="text-sm text-grey mb-6">
            Get immediate access to both preparation resources. Choose a guide
            below to download:
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {[
              ["1", "The Examiner's Briefing"],
              ["2", "The Examiner's Error Log"],
            ].map(([id, name]) => {
              return (
                <button
                  key={id}
                  type="button"
                  disabled={downloading !== null}
                  onClick={() => void downloadGift(id as "1" | "2", name)}
                  className="group inline-flex min-h-11 items-center gap-3 rounded-xl border border-gold bg-tint px-4 py-2.5 text-start font-sans text-sm font-semibold text-navy! transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:border-goldd hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-60 shadow-xs cursor-pointer w-auto "
                >
                  <span className="flex items-center gap-2">
                    {downloading === id ? (
                      <Loader2
                        className="animate-spin text-navy! shrink-0"
                        size={17}
                      />
                    ) : (
                      <Gift
                        className="text-navy! shrink-0 transition-transform duration-300 group-hover:animate-gift-wiggle group-hover:text-navy!"
                        size={17}
                      />
                    )}
                    <span className="font-medium text-navy!">{name}</span>
                  </span>
                  <Download
                    className="text-navy! shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                    size={15}
                  />
                </button>
              );
            })}
          </div>

          {downloadError ? (
            <p role="alert" className="text-xs text-red-600 mt-2">
              Unable to download the resource. Please try again.
            </p>
          ) : null}

          <small className="block mt-5 text-xs leading-relaxed text-grey">
            You will get immediate access to the PDF. After that, occasional
            notes from the examiner&apos;s side of the table — unsubscribe in
            one click.
          </small>
        </div>
      </div>
    </section>
  );
}
