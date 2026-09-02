import Link from "next/link";

interface AcademyPreviewSectionProps {
  locale: string;
}

export default function AcademyPreviewSection({ locale }: AcademyPreviewSectionProps) {
  return (
    <section className="bg-paper py-24 border-b border-line" aria-labelledby="academy-preview-heading">
      <div className="mx-auto w-full px-6 md:px-8 lg:px-12" style={{ maxWidth: "var(--content-max)" }}>
        
        <div data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left CTA block */}
          <div className="lg:col-span-4 bg-ink text-white p-8 md:p-10 border border-white/10 flex flex-col justify-between h-full min-h-[360px]">
            <div>
              <span className="font-body text-[10px] uppercase tracking-[0.25em] text-signal font-semibold">
                Learn. Apply. Advance.
              </span>
              <h2 id="academy-preview-heading" className="font-display text-2xl md:text-3xl text-white mt-3 leading-snug">
                Your Learning. Your Progress.
              </h2>
              <p className="mt-4 font-body text-sm text-white/60 leading-relaxed">
                Track your structured modules, complete rigorous assessments, earn verifiable credentials, and review clinical case downloads.
              </p>
            </div>
            
            <div className="pt-8">
              <Link
                href={`/${locale}/academy`}
                className="inline-flex items-center gap-2 border border-signal px-6 py-3 font-body text-xs tracking-wider uppercase text-signal hover:bg-signal hover:text-ink transition-colors"
              >
                Explore Dashboard →
              </Link>
            </div>
          </div>

          {/* Right Dashboard UI Mockup */}
          <div className="lg:col-span-8 bg-surface border border-line p-6 md:p-8 shadow-sm">
            
            {/* Top Bar of Student Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-line gap-4">
              <div>
                <span className="font-body text-xs text-muted uppercase tracking-wider">Learner Portal</span>
                <h3 className="font-display text-xl text-white">Welcome back, Dr. Sara</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 bg-surface-2 border border-line text-xs font-body text-muted">
                  Active Enrollment: 1
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-signal/15 border border-signal/30 text-xs font-body text-signal font-semibold">
                  150 Points Earned
                </span>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Continue Course Card */}
              <div className="md:col-span-2 bg-surface-2 border border-line p-5 flex flex-col justify-between">
                <div>
                  <span className="font-body text-[10px] uppercase tracking-wider text-muted">Continue Learning</span>
                  <h4 className="font-display text-base text-white mt-1">Expert Witness in Forensic Psychiatry</h4>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-body text-muted mb-1.5">
                      <span>Module 4 of 6</span>
                      <span className="font-semibold text-signal">72%</span>
                    </div>
                    <div className="w-full bg-line h-2">
                      <div className="bg-signal h-2" style={{ width: "72%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/${locale}/academy`}
                    className="bg-accent-soft hover:bg-accent text-white font-body text-xs px-4 py-2 transition-colors border border-line"
                  >
                    Resume Module →
                  </Link>
                </div>
              </div>

              {/* Progress Overview Donut / Stats */}
              <div className="bg-surface-2 border border-line p-5 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-line"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-signal"
                      strokeDasharray="72, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-display text-base text-white">72%</span>
                </div>
                <span className="font-body text-xs font-semibold text-white mt-2">Overall Completion</span>
                <div className="mt-2 text-[11px] font-body text-muted space-y-0.5">
                  <p>13 Activities Completed</p>
                  <p>4 Remaining</p>
                </div>
              </div>

            </div>

            {/* Issued Certificate Preview row */}
            <div className="mt-6 p-4 bg-surface-2 border border-line flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl text-signal">🎖</span>
                <div>
                  <h5 className="font-display text-sm text-white">Certificate of Medicolegal Foundations</h5>
                  <p className="font-body text-[11px] text-muted">Issued on May 15, 2026 • Verified Serial #ML-8842</p>
                </div>
              </div>
              <span className="font-body text-xs text-signal font-medium cursor-pointer hover:underline">
                Download PDF ⬇
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
