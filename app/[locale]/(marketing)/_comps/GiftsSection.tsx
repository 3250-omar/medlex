"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type GiftKey = "casc" | "medicoLegal" | "foundations";

interface GiftCardProps {
  pathway: string;
  title: string;
  description: string;
  emailPlaceholder: string;
  sendLabel: string;
  sendingLabel: string;
  successMessage: string;
  giftKey: GiftKey;
}

function GiftCard({
  pathway,
  title,
  description,
  emailPlaceholder,
  sendLabel,
  sendingLabel,
  successMessage,
  giftKey,
}: GiftCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/gifts/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, gift: giftKey }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(
          data?.error ?? "Something went wrong. Please try again.",
        );
        setStatus("error");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <article className="flex flex-col rounded-sm border border-gold/30 bg-white shadow-sm">
      {/* Top gold accent line */}
      <div className="h-0.5 w-full bg-gold/60 rounded-t-sm" />

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        {/* Pathway label */}
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
          {pathway}
        </span>

        {/* Title */}
        <h3 className="mt-3 font-serif text-xl sm:text-2xl font-semibold leading-snug !text-navy">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-4 flex-1 font-sans text-sm sm:text-[15px] leading-relaxed text-slate-600">
          {description}
        </p>

        {/* Form */}
        <div className="mt-7">
          {status === "success" ? (
            <p className="font-sans text-sm font-medium text-gold">
              {successMessage}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex gap-0 rounded-sm overflow-hidden border border-slate-200 focus-within:border-gold/60 focus-within:ring-1 focus-within:ring-gold/30 transition-all">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-sm text-navy outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "shrink-0 bg-navy px-5 py-3 font-sans text-sm font-semibold text-white transition-colors",
                    status === "loading"
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-navy-deep",
                  )}
                >
                  {status === "loading" ? sendingLabel : sendLabel}
                </button>
              </div>
              {status === "error" && (
                <p className="font-sans text-xs text-red-600">{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

export default function GiftsSection() {
  const t = useTranslations("home.gifts");

  const cards: { giftKey: GiftKey }[] = [
    { giftKey: "casc" },
    { giftKey: "medicoLegal" },
    { giftKey: "foundations" },
  ];

  return (
    <section
      className="bg-[#fbfaf6] py-20 lg:py-28 border-b border-[#e6e6e0]"
      aria-labelledby="gifts-heading"
    >
      <div className="px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-28">
        {/* Section header */}
        <div className="max-w-3xl">
          <h2
            id="gifts-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-navy!"
          >
            {t("title")}
          </h2>
          <div className="mt-4 h-0.5 w-14 bg-gold" />
          <p className="mt-5 font-sans text-base sm:text-lg leading-relaxed text-body max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ giftKey }) => (
            <GiftCard
              key={giftKey}
              giftKey={giftKey}
              pathway={t(`cards.${giftKey}.pathway`)}
              title={t(`cards.${giftKey}.title`)}
              description={t(`cards.${giftKey}.description`)}
              emailPlaceholder={t("emailPlaceholder")}
              sendLabel={t("sendLabel")}
              sendingLabel={t("sendingLabel")}
              successMessage={t("successMessage")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
