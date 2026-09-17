"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "./ui/SectionHeader";
import { DEFAULT_ROLE_OPTIONS } from "./foundations.constants";

export default function FoundationsWaitlistSection() {
  const t = useTranslations("pathwayPages.foundationsLanding.waitlist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor in training");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const roleOptions: string[] =
    (t.raw("roleOptions") as string[]) || DEFAULT_ROLE_OPTIONS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <section
      className="bg-fd-paper border-b border-fd-stone py-20 lg:py-24 text-fd-body"
      id="waitlist"
    >
      <div className="max-w-[1120px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div>
            <SectionHeader
              title={t("title")}
              titleClassName="text-fd-navy!"
              lead={t("lead")}
            />

            {submitted ? (
              <div className="mt-6 p-4.5 sm:p-5 bg-fd-navy text-white rounded text-[15.5px] font-medium max-w-[560px] leading-[1.5]">
                <b>{t("successTitle")}</b>
                <p className="mt-1.5 text-[#dce1ea] text-[14.5px]">
                  {t("successDesc", { name: name || "there", email })}
                </p>
              </div>
            ) : (
              <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7 max-w-[560px]"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder={
                    t.has("namePlaceholder")
                      ? t("namePlaceholder")
                      : "Full name"
                  }
                  aria-label="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-sans text-[15px] px-3.5 py-3 border-[1.5px] border-fd-stone rounded bg-white text-fd-ink placeholder:text-fd-muted focus:outline-none focus:ring-2 focus:ring-fd-gold"
                  required
                />
                <input
                  type="email"
                  placeholder={
                    t.has("emailPlaceholder")
                      ? t("emailPlaceholder")
                      : "Professional email"
                  }
                  aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-sans text-[15px] px-3.5 py-3 border-[1.5px] border-fd-stone rounded bg-white text-fd-ink placeholder:text-fd-muted focus:outline-none focus:ring-2 focus:ring-fd-gold"
                  required
                />
                <select
                  aria-label="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="sm:col-span-2 font-sans text-[15px] px-3.5 py-3 border-[1.5px] border-fd-stone rounded bg-white text-fd-ink focus:outline-none focus:ring-2 focus:ring-fd-gold"
                >
                  {roleOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:col-span-2 justify-self-start font-sans font-semibold text-[15px] px-6 py-3.5 rounded bg-fd-navy hover:bg-fd-navy-deep text-white transition-colors cursor-pointer border-0 disabled:opacity-70"
                >
                  {submitting
                    ? "..."
                    : t.has("buttonText")
                      ? t("buttonText")
                      : "Join the waitlist"}
                </button>
              </form>
            )}
          </div>
          <figure className="m-0">
            <img
              src="/images/foundations/waitlist_video_call.jpg"
              alt="A doctor joining a video call with colleagues across the region"
              className="rounded-md aspect-[16/11] object-cover w-full shadow-[0_24px_50px_rgba(20,40,75,0.22)]"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
