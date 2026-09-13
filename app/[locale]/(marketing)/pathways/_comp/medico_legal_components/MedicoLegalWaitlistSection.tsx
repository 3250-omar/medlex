"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MedicoLegalWaitlistSection() {
  const t = useTranslations("pathwayPages.medicoLegalLanding.waitlist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("Psychiatrist");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const triggerCelebration = useCallback(() => {
    const count = 220;
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
    triggerCelebration();
  }

  return (
    <section
      id="waitlist"
      className="bg-white text-char py-24 border-b border-hair"
    >
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-4xl lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-sans font-semibold text-xs uppercase tracking-widest text-goldd block mb-3">
            {t("kicker")}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink! leading-tight">
            {t("title")}
          </h2>
          <div className="w-14 h-0.5 bg-gold my-5 mx-auto" />
          <p className="font-serif text-lg sm:text-xl text-char/85 leading-relaxed">
            {t("lead")}
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          {submitted ? (
            <div className="bg-tint border border-gold/40 rounded-2xl p-8 text-center shadow-md animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-12 h-12 text-goldd mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-navy mb-2">
                {t("successTitle")}
              </h3>
              <p className="text-base text-char/90 font-sans leading-relaxed">
                {t("successDesc", { name, profession, email })}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-tint/50 border border-hair rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm"
            >
              <div>
                <label className="block text-xs font-sans font-semibold text-ink uppercase tracking-wider mb-2">
                  {t("nameLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-hair text-ink placeholder:text-grey/60 focus:outline-none focus:border-gold text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-ink uppercase tracking-wider mb-2">
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-hair text-ink placeholder:text-grey/60 focus:outline-none focus:border-gold text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-ink uppercase tracking-wider mb-2">
                  {t("professionLabel")}
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-hair text-ink focus:outline-none focus:border-gold text-base"
                >
                  <option value="Psychiatrist">
                    {t("professions.psychiatrist")}
                  </option>
                  <option value="Psychologist">
                    {t("professions.psychologist")}
                  </option>
                  <option value="Psychiatry trainee">
                    {t("professions.trainee")}
                  </option>
                  <option value="Legal professional">
                    {t("professions.legal")}
                  </option>
                  <option value="Other">{t("professions.other")}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gold text-navy font-sans font-bold text-base hover:bg-[#A8842F] transition-all shadow-md disabled:opacity-50 mt-4 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("reservingText")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("buttonText")}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-grey font-sans pt-2">
                {t("privacyNote")}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
