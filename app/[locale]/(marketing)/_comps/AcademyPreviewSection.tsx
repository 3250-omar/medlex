import Link from "next/link";

interface AcademyPreviewSectionProps {
  locale: string;
}

export default function AcademyPreviewSection({
  locale,
}: AcademyPreviewSectionProps) {
  return (
    <section
      className="bg-warm/30 py-24 border-b border-hair"
      aria-labelledby="academy-preview-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left CTA block */}
          <div className="lg:col-span-4 rounded-2xl bg-navy text-lbody p-8 md:p-10 border border-white/10 flex flex-col justify-between h-full min-h-[360px] shadow-sm">
            <div>
              <span className="kicker text-gold font-semibold">
                Learn. Apply. Advance.
              </span>
              <h2
                id="academy-preview-heading"
                className="font-serif text-2xl md:text-3xl text-white font-normal mt-3 leading-snug"
              >
                Your Learning. Your Progress.
              </h2>
              <p className="mt-4 font-sans text-sm text-lbody leading-relaxed">
                Track your structured modules, complete rigorous assessments,
                earn verifiable credentials, and review clinical case downloads.
              </p>
            </div>

            <div className="pt-8">
              <Link
                href={`/${locale}/academy`}
                className="btn btn-gold !rounded-full !px-6 !py-3 font-body text-xs tracking-wider uppercase text-navy font-semibold inline-flex items-center gap-2"
              >
                Explore Dashboard →
              </Link>
            </div>
          </div>

          {/* Right Dashboard UI Mockup */}
          <div className="lg:col-span-8 rounded-2xl bg-white border border-hair p-6 md:p-8 shadow-sm text-char">
            {/* Top Bar of Student Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-hair gap-4">
              <div>
                <span className="font-body text-xs text-goldd uppercase tracking-wider font-semibold">
                  Learner Portal
                </span>
                <h3 className="font-serif text-2xl text-navy font-normal mt-1">
                  Welcome back, Dr. Sara
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-warm border border-hair text-xs font-body text-char/80">
                  Active Enrollment: 1
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-xs font-body text-navy font-semibold">
                  150 Points Earned
                </span>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Continue Course Card */}
              <div className="md:col-span-2 rounded-xl bg-warm/40 border border-hair p-6 flex flex-col justify-between">
                <div>
                  <span className="font-body text-[10px] uppercase tracking-wider text-char/60 font-semibold">
                    Continue Learning
                  </span>
                  <h4 className="font-serif text-lg text-navy font-normal mt-1">
                    Expert Witness in Forensic Psychiatry
                  </h4>

                  {/* Progress Bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-body text-char/70 mb-1.5">
                      <span>Module 4 of 6</span>
                      <span className="font-semibold text-navy">72%</span>
                    </div>
                    <div className="w-full bg-hair h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gold h-2 rounded-full"
                        style={{ width: "72%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/${locale}/academy`}
                    className="btn btn-navy !rounded-full !px-5 !py-2 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    Resume Module →
                  </Link>
                </div>
              </div>

              {/* Progress Overview Donut / Stats */}
              <div className="rounded-xl bg-warm/40 border border-hair p-6 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-hair"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-gold"
                      strokeDasharray="72, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-serif text-base text-navy font-normal">
                    72%
                  </span>
                </div>
                <span className="font-serif text-sm font-normal text-navy mt-2">
                  Overall Completion
                </span>
                <div className="mt-2 text-[11px] font-sans text-char/70 space-y-0.5">
                  <p>13 Activities Completed</p>
                  <p>4 Remaining</p>
                </div>
              </div>
            </div>

            {/* Issued Certificate Preview row */}
            <div className="mt-6 p-4 rounded-xl bg-warm/30 border border-hair flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎖</span>
                <div>
                  <h5 className="font-serif text-sm text-navy font-normal">
                    Certificate of Medicolegal Foundations
                  </h5>
                  <p className="font-sans text-[11px] text-char/60">
                    Issued on May 15, 2026 • Verified Serial #ML-8842
                  </p>
                </div>
              </div>
              <span className="font-body text-xs text-goldd font-semibold cursor-pointer hover:underline">
                Download PDF ⬇
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
