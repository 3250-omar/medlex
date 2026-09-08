"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, MessageSquareHeart, Sparkles } from "lucide-react";
import { useCourseOutline } from "../_apiCalls/learningQueries";
import { apiRequest } from "@/lib/api/client";

type Props = { courseSlug: string; locale: string };
const prompts = [
  "The course was clear, practical, and helped me feel more confident in my clinical conversations.",
  "The realistic scenarios and feedback helped me understand what to improve in my next consultation.",
  "I appreciated the structure of the lessons and would recommend this course to a colleague.",
];
function categoryFor(slug: string) {
  return slug.startsWith("station") ? "Stations" : "Domains";
}

export default function CourseCompletion({ courseSlug, locale }: Props) {
  const router = useRouter();
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const { data: outline, isLoading } = useCourseOutline(courseSlug);
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const stats = useMemo(() => {
    const units = outline?.units ?? [];
    const completed = units.filter(
      (unit) => unit.status === "completed" || unit.progressPercent >= 100,
    );
    const categories = ["Domains", "Stations"]
      .map((name) => ({
        name,
        completed: completed.filter((unit) => categoryFor(unit.slug) === name)
          .length,
        total: units.filter((unit) => categoryFor(unit.slug) === name).length,
      }))
      .filter((category) => category.total > 0);
    return {
      completed: completed.length,
      total: units.length,
      percent: units.length
        ? Math.round((completed.length / units.length) * 100)
        : 0,
      categories,
    };
  }, [outline]);
  async function submitFeedbackAndContinue() {
    if (!feedback.trim()) {
      setError(
        "Please share your feedback before continuing to your certificate.",
      );
      feedbackRef.current?.focus();
      return;
    }
    setIsSending(true);
    setError("");
    try {
      await apiRequest(`/api/academy/courses/${courseSlug}/feedback`, {
        method: "POST",
        body: JSON.stringify({ feedback }),
      });
      router.push(`/${locale}/academy/courses/${courseSlug}/certificate`);
    } catch {
      setError("We could not send your feedback. Please try again.");
      setIsSending(false);
    }
  }
  if (isLoading)
    return (
      <main className="min-h-screen bg-surface px-6 py-24 text-center text-muted">
        Loading your achievement…
      </main>
    );
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_32%),linear-gradient(180deg,#0e2238_0%,#081525_75%)] px-4 py-20! sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-gold/30 bg-deep p-8 text-center shadow-2xl backdrop-blur sm:p-12">
          <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gold text-navy shadow-xl shadow-gold/20">
            <Sparkles aria-hidden="true" />
          </span>
          <p className="kicker text-gold">Course complete</p>
          <h1 className="mt-4 font-serif text-4xl font-normal text-white sm:text-6xl">
            Congratulations!
          </h1>
          <p className="mt-3 font-sans text-lbody">
            You finished {stats.completed} of {stats.total} lessons —{" "}
            {stats.percent}% complete.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4">
            {stats.categories.map((category) => (
              <div
                key={category.name}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 shadow-inner"
              >
                <b className="block font-serif text-3xl font-normal text-gold">
                  {category.completed}/{category.total}
                </b>
                <span className="font-sans text-xs text-mute">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-white/10 bg-deep p-8 shadow-2xl sm:p-12">
          <p className="kicker text-gold">One final thought</p>
          <h2 className="mt-3 flex items-center gap-3 font-serif text-3xl font-normal text-white sm:text-4xl">
            <MessageSquareHeart className="size-8 text-gold" /> Your voice
            matters
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-lbody">
            Your perspective helps us make this course better for every learner
            who follows you. Choose a thought below or write your own.
          </p>
          <div className="mt-6 grid gap-3">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setFeedback(prompt);
                  setError("");
                }}
                className={`min-h-16 rounded-2xl border p-5 text-left text-sm leading-relaxed transition-all ${feedback === prompt ? "border-gold bg-gold/10 text-white shadow-md shadow-gold/10" : "border-white/10 bg-white/[0.02] text-mute hover:border-gold/40 hover:bg-white/5 hover:text-white"}`}
              >
                {prompt}
              </button>
            ))}
          </div>
          <label
            className="mt-8 block font-sans text-sm font-semibold text-white"
            htmlFor="feedback"
          >
            Your feedback <span className="text-gold">*</span>
          </label>
          <textarea
            id="feedback"
            ref={feedbackRef}
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
              setError("");
            }}
            placeholder="Tell us what made the biggest difference…"
            className="mt-2 min-h-52 w-full rounded-2xl border border-white/10 bg-navy p-5 font-sans text-base leading-relaxed text-white outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
            required
          />
          {error && (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={submitFeedbackAndContinue}
            disabled={isSending}
            className="btn btn-gold !rounded-full mt-8 flex min-h-14 w-full items-center justify-center gap-3 !px-8 text-base font-semibold text-navy shadow-lg shadow-gold/20 transition-all hover:shadow-gold/30 disabled:cursor-wait disabled:opacity-60"
          >
            <CheckCircle2 aria-hidden="true" />
            {isSending
              ? "Sending feedback…"
              : "Send feedback & get certificate"}
          </button>
        </section>
      </div>
    </main>
  );
}
