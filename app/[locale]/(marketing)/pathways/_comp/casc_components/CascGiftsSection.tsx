"use client";

import { useCallback, useContext, useState } from "react";
import { Loader2 } from "lucide-react";
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
  const { data: _giftStatus } = useGiftStatus(Boolean(user));
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [downloading, setDownloading] = useState<"1" | "2" | "both" | null>(
    null,
  );
  const [downloadError, setDownloadError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  async function downloadResource(id: "1" | "2", fileName: string) {
    try {
      let blob: Blob;
      try {
        const response = await fetch(`/api/gifts/download?gift=${id}`);
        if (response.ok) {
          blob = await response.blob();
        } else {
          const fallbackRes = await fetch(
            `/gifts/${encodeURIComponent(fileName)}`,
          );
          if (!fallbackRes.ok) throw new Error("Fallback failed");
          blob = await fallbackRes.blob();
        }
      } catch {
        const fallbackRes = await fetch(
          `/gifts/${encodeURIComponent(fileName)}`,
        );
        if (!fallbackRes.ok) throw new Error("Fallback failed");
        blob = await fallbackRes.blob();
      }

      const cleanFileName =
        fileName
          .replace(/(\s*-\s*downloaded.*)+/gi, "")
          .replace(/\.pdf$/i, "") + ".pdf";

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = cleanFileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      if (user) {
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
      }
      return true;
    } catch {
      return false;
    }
  }

  async function handleDownloadSingle(id: "1" | "2", fileName: string) {
    setDownloading(id);
    setDownloadError(false);
    const success = await downloadResource(id, fileName);
    setDownloading(null);
    if (success) {
      triggerCelebration();
    } else {
      setDownloadError(true);
    }
  }

  async function handleSendBoth(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      return;
    }

    setDownloading("both");
    setDownloadError(false);

    const s1 = await downloadResource("1", "The Examiner's Briefing.pdf");
    await new Promise((r) => setTimeout(r, 350));
    const s2 = await downloadResource("2", "The Examiner's Error Log.pdf");

    setDownloading(null);

    if (s1 || s2) {
      triggerCelebration();
      setSubmitted(true);
    } else {
      setDownloadError(true);
    }
  }

  return (
    <section
      id="gifts"
      className="relative py-20 lg:py-28 border-y border-hair bg-[#EFE9DD] text-char overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] xl:grid-cols-[470px_1fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Two 3D Book Mockups */}
          <div className="relative flex items-center justify-center lg:justify-start py-6 sm:py-8 select-none">
            {/* Soft table cast shadow */}
            <div
              className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 lg:left-36 w-64 sm:w-80 h-7 bg-[#0E1D38]/20 blur-xl rounded-full pointer-events-none"
              aria-hidden="true"
            />

            {/* Book 1: The Examiner's Briefing (Back / Left) */}
            <div
              onClick={() =>
                void handleDownloadSingle("1", "The Examiner's Briefing.pdf")
              }
              className="group relative w-44 sm:w-52 md:w-56 aspect-[3/4.3] rounded-[4px] border-l-[10px] sm:border-l-[12px] border-[#B8933D] bg-gradient-to-br from-[#1B3766] via-[#142A4E] to-[#0E1D38] p-4 sm:p-5 text-white shadow-[0_22px_45px_rgba(20,40,75,0.38)] -rotate-[4.5deg] transition-all duration-300 hover:-translate-y-2 hover:rotate-[-5.5deg] hover:shadow-[0_28px_55px_rgba(20,40,75,0.48)] cursor-pointer z-10 flex flex-col justify-between"
              title="Click to download The Examiner's Briefing"
            >
              {/* Spine crease shadow */}
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
              {/* Subtle cover sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08] pointer-events-none rounded-[4px]" />

              {/* Book 1 Header: Logo */}
              <div className="relative z-10 flex items-center gap-2">
                <img
                  src="/images/medicolegal/img_4_.png"
                  alt=""
                  className="h-5 sm:h-6 w-auto brightness-110"
                />
                <span className="font-serif text-xs sm:text-sm font-semibold tracking-[0.12em] text-[#D9C08A]">
                  MEDLEX
                </span>
              </div>

              {/* Book 1 Body: Kicker + Title */}
              <div className="relative z-10 my-auto pt-6 sm:pt-8">
                <p className="font-serif italic text-[11px] sm:text-xs text-[#D9C08A] tracking-wider mb-2">
                  Free guide
                </p>
                <h3 className="font-serif text-xl sm:text-[24px] font-bold leading-[1.15] text-white tracking-tight">
                  The Examiner&apos;s
                  <span className="block mt-0.5 font-bold">Briefing</span>
                </h3>
              </div>

              {/* Book 1 Footer */}
              <div className="relative z-10 pt-4">
                <p className="font-serif italic text-[10px] sm:text-[11.5px] text-[#D9C08A]/90 tracking-normal">
                  Where Medicine Meets Justice
                </p>
              </div>
            </div>

            {/* Book 2: The Examiner's Error Log (Front / Right) */}
            <div
              onClick={() =>
                void handleDownloadSingle("2", "The Examiner's Error Log.pdf")
              }
              className="group relative w-44 sm:w-52 md:w-56 aspect-[3/4.3] rounded-[4px] border-l-[10px] sm:border-l-[12px] border-[#B8933D] bg-gradient-to-br from-[#1C3A6B] via-[#142A4E] to-[#0C1A32] p-4 sm:p-5 text-white shadow-[-8px_25px_50px_rgba(15,29,56,0.42)] rotate-[2.5deg] -ml-20 sm:-ml-24 mt-8 sm:mt-10 transition-all duration-300 hover:-translate-y-2 hover:rotate-[1.5deg] hover:shadow-[-8px_32px_60px_rgba(15,29,56,0.52)] cursor-pointer z-20 flex flex-col justify-between"
              title="Click to download The Examiner's Error Log"
            >
              {/* Spine crease shadow */}
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
              {/* Subtle cover sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08] pointer-events-none rounded-[4px]" />

              {/* Book 2 Header: Logo */}
              <div className="relative z-10 flex items-center gap-2">
                <img
                  src="/images/medicolegal/img_4_.png"
                  alt=""
                  className="h-5 sm:h-6 w-auto brightness-110"
                />
                <span className="font-serif text-xs sm:text-sm font-semibold tracking-[0.12em] text-[#D9C08A]">
                  MEDLEX
                </span>
              </div>

              {/* Book 2 Body: Kicker + Title */}
              <div className="relative z-10 my-auto pt-6 sm:pt-8">
                <p className="font-serif italic text-[11px] sm:text-xs text-[#D9C08A] tracking-wider mb-2">
                  Free tool
                </p>
                <h3 className="font-serif text-xl sm:text-[24px] font-bold leading-[1.15] text-white tracking-tight">
                  The Examiner&apos;s
                  <span className="block mt-0.5 font-bold">Error Log</span>
                </h3>
              </div>

              {/* Book 2 Footer */}
              <div className="relative z-10 pt-4">
                <p className="font-serif italic text-[10px] sm:text-[11.5px] text-[#D9C08A]/90 tracking-normal">
                  Where Medicine Meets Justice
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Text and Download Form */}
          <div>
            {/* Tag badge: dark navy pill with gold/soft text */}
            <div className="inline-block bg-[#0E1D38] text-[#E8D4A0] text-xs font-semibold px-3 py-1.5 rounded-[3px] tracking-wide mb-4">
              Before you enrol
            </div>

            {/* Section title */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-navy! leading-[1.16] tracking-tight">
              Two things from the examiner&apos;s chair, free
            </h2>

            {/* Lead paragraph */}
            <p className="font-serif italic text-[16px] sm:text-[17.5px] text-[#3A4352]! leading-relaxed mt-5 max-w-[560px]">
              The Examiner&apos;s Briefing — how the CASC is actually marked,
              the errors examiners see most, and the grammar of a British
              consultation. The Examiner&apos;s Error Log — a one-page
              self-audit you fill in after every practice station, so the person
              watching you can tick what they saw.
            </p>

            {/* Email form */}
            <form
              onSubmit={handleSendBoth}
              className="mt-7 flex flex-col sm:flex-row gap-2.5 max-w-[520px]"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your professional email"
                aria-label="Your professional email"
                className="flex-1 min-w-0 bg-white border-[1.5px] border-[#0E1D38] text-[#0E1D38] placeholder:text-[#8C93A0] rounded-[4px] px-4 py-3 sm:py-3.5 text-[15px] font-sans focus:outline-none focus:ring-2 focus:ring-[#B8933D]"
              />
              <button
                type="submit"
                disabled={downloading !== null}
                className="bg-[#0E1D38] hover:bg-[#1A365D] active:bg-[#0A162B] text-white font-medium text-[15px] px-6 py-3 sm:py-3.5 rounded-[4px] transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-70 shadow-xs"
              >
                {downloading === "both" ? (
                  <>
                    <Loader2
                      className="animate-spin text-white shrink-0"
                      size={16}
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  "Send me both"
                )}
              </button>
            </form>

            {submitted && (
              <div className="mt-4 p-3.5 rounded-[4px] bg-[#0E1D38]! text-white max-w-[520px] text-xs sm:text-sm">
                <p className="font-semibold text-[#E8D4A0]">
                  Both resources are downloading!
                </p>
                <p className="text-white/80 mt-1 text-xs">
                  If your browser blocked the second download, click directly:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      void handleDownloadSingle(
                        "1",
                        "The Examiner's Briefing.pdf",
                      )
                    }
                    className="text-xs bg-white/10 hover:bg-white/20 text-[#D9C08A] px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    The Examiner&apos;s Briefing.pdf
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void handleDownloadSingle(
                        "2",
                        "The Examiner's Error Log.pdf",
                      )
                    }
                    className="text-xs bg-white/10 hover:bg-white/20 text-[#D9C08A] px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    The Examiner&apos;s Error Log.pdf
                  </button>
                </div>
              </div>
            )}

            {downloadError && (
              <p role="alert" className="text-xs text-red-600 mt-2">
                Unable to download the resources. Please try again.
              </p>
            )}

            {/* Footnote / Note */}
            <p className="mt-3.5 text-xs sm:text-[12.5px] leading-relaxed text-[#6B7382] max-w-[520px]">
              Both PDFs, immediately. Then occasional notes from the
              examiner&apos;s side of the table — unsubscribe in one click. No
              card, no commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
