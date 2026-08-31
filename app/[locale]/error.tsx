"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[MedLex error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 bg-paper px-6 text-center">
      <div className="h-px w-16 bg-signal/50" />
      <div>
        <p className="mb-2 font-body text-[9px] uppercase tracking-[0.3em] text-muted">
          Something went wrong
        </p>
        <h1 className="font-display text-3xl text-ink">
          An unexpected error occurred.
        </h1>
        <p className="mt-4 font-body text-sm text-muted">
          Please try again. If the problem persists, contact{" "}
          <a
            href="mailto:info@medlex.academy"
            className="text-signal underline underline-offset-2"
          >
            info@medlex.academy
          </a>
          .
        </p>
      </div>
      <button
        onClick={reset}
        className="border border-ink px-8 py-3 font-body text-sm text-ink transition-colors hover:bg-ink hover:text-white"
      >
        Try again
      </button>
    </div>
  );
}
