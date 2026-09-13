"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MedicoLegalGiftSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.gift");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const triggerCelebration = useCallback(() => {
    const count = 180;
    const defaults = { origin: { y: 0.7 }, zIndex: 99999 };

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    triggerCelebration();
  }

  return (
    <section
      id="gift"
      className="bg-navy text-lbody on-navy py-24 border-b border-white/10 overflow-hidden"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 3D-styled Book Cover Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[1/1.4] rounded-2xl bg-gradient-to-br from-deep via-navy to-[#0b172a] border-2 border-gold/40 shadow-2xl p-7 flex flex-col justify-between text-white overflow-hidden group">
              {/* Gold decorative corner accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-bl-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/5 rounded-full pointer-events-none" />

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/images/new-emblem-transparent.png"
                      alt="MedLex Emblem"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-serif font-bold text-sm tracking-widest text-gold">
                    {t("bookBrand")}
                  </span>
                </div>

                <div className="text-xs font-sans font-semibold tracking-widest uppercase text-goldd mb-3">
                  {t("bookKicker")}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-white group-hover:text-gold transition-colors">
                  {t("bookTitle")}
                </h3>
              </div>

              <div className="pt-6 border-t border-white/15 text-xs text-mute font-serif italic">
                {t("bookFoot")}
              </div>
            </div>
          </div>

          {/* Right Column: Gift Pitch & Form */}
          <div className="lg:col-span-7">
            <span className="inline-block font-sans font-semibold text-xs uppercase tracking-widest text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-4">
              {t("tag")}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight">
              {t("title")}
            </h2>
            <div className="w-14 h-0.5 bg-gold my-5" />

            <p className="font-serif text-lg sm:text-xl text-lbody leading-relaxed mb-8">
              {t("lead")}
            </p>

            {submitted ? (
              <div className="bg-navy2/90 border border-gold/40 rounded-2xl p-6 sm:p-7 flex items-center gap-4 text-white shadow-lg animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-8 h-8 text-gold shrink-0" />
                <div>
                  <b className="block text-base font-sans font-semibold text-white mb-1">
                    {t("successTitle")}
                  </b>
                  <p className="text-sm text-lbody font-sans">
                    {t("successDesc", { email })}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("inputPlaceholder")}
                    className="flex-1 px-4 py-3.5 rounded-xl bg-deep/90 border border-white/20 text-white placeholder:text-mute focus:outline-none focus:border-gold text-base"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-navy font-semibold text-[15px] hover:bg-[#A8842F] transition-all disabled:opacity-50 shrink-0 shadow-md cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("sendingText")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("buttonText")}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-mute font-sans">{t("note")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
