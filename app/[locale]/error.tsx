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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy on-navy px-6 text-center text-lbody">
      <div className="h-px w-16 bg-gold/50" />
      <div>
        <p className="kicker text-gold mb-3">
          Something went wrong
        </p>
        <h1 className="font-serif text-3xl font-normal text-white sm:text-4xl">
          An unexpected error occurred.
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-lbody max-w-sm mx-auto">
          Please try again. If the problem persists, contact{" "}
          <a
            href="mailto:info@medlex.academy"
            className="text-gold underline underline-offset-2 hover:text-goldd"
          >
            info@medlex.academy
          </a>
          .
        </p>
      </div>
      <button
        onClick={reset}
        className="btn btn-gold !rounded-full !px-8 !py-3.5 text-sm font-semibold text-navy inline-flex items-center justify-center"
      >
        Try again
      </button>
    </div>
  );
}
