import Link from "next/link";

const MODULES = [
  { num: "01", title: "Role & Responsibilities of the Expert Witness" },
  { num: "02", title: "Assessment & Evaluation Standards" },
  { num: "03", title: "Report Writing That Withstands Scrutiny" },
  { num: "04", title: "Courtroom Testimony: Preparation & Delivery" },
  { num: "05", title: "Cross-Examination: Techniques & Pitfalls" },
  { num: "06", title: "Ethics, Bias & Professional Boundaries" },
];

const SPECS = [
  { icon: "📁", label: "6", sub: "Modules" },
  { icon: "▶", label: "30+", sub: "Video Lessons" },
  { icon: "⏱", label: "18+", sub: "Hours of Content" },
  { icon: "∞", label: "Lifetime", sub: "Access to Materials" },
];

interface FlagshipCourseSectionProps {
  locale: string;
}

export default function FlagshipCourseSection({ locale }: FlagshipCourseSectionProps) {
  return (
    <section className="bg-surface py-24 lg:py-32 border-b border-line" aria-labelledby="flagship-heading">
      <div className="mx-auto w-full px-6 md:px-8 lg:px-12" style={{ maxWidth: "var(--content-max)" }}>
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-signal" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-signal font-semibold">
              Flagship Course
            </span>
          </div>
          <h2 id="flagship-heading" className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">
            Expert Witness in Forensic Psychiatry
          </h2>
          <p className="mt-4 font-body text-muted max-w-2xl text-base">
            Master the science, law, and courtroom skills to deliver credible, ethical, and effective expert testimony.
          </p>
        </div>

        {/* Main Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 2 Cols: Course Overview & Syllabus */}
          <div className="lg:col-span-2 bg-ink text-white p-8 md:p-12 border border-white/10 relative overflow-hidden">
            {/* Background seal watermark */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 pointer-events-none opacity-5">
              <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" />
                <path d="M50 15 L50 85 M25 35 L75 35 M20 50 L80 50" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8 mb-8 border-b border-white/10">
              {SPECS.map((s, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-display text-2xl text-signal">{s.label}</span>
                  <span className="font-body text-xs text-white/60 tracking-wide uppercase mt-1">{s.sub}</span>
                </div>
              ))}
            </div>

            {/* Course Modules List */}
            <div>
              <h3 className="font-body text-xs uppercase tracking-[0.2em] text-white/50 mb-6">
                Course Syllabus Breakdown
              </h3>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {MODULES.map((m) => (
                  <div key={m.num} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors px-2">
                    <div className="flex items-center gap-4">
                      <span className="font-body text-xs text-signal font-mono">{m.num}</span>
                      <span className="font-display text-sm md:text-base text-white/90 group-hover:text-white transition-colors">
                        {m.title}
                      </span>
                    </div>
                    <span className="text-white/30 group-hover:text-signal text-xs">▾</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between pt-4">
              <Link
                href={`/${locale}/courses/expert-witness-forensic-psychiatry`}
                className="inline-flex items-center gap-2 font-body text-sm text-signal hover:underline"
              >
                View Full Syllabus & Objectives →
              </Link>
            </div>
          </div>

          {/* Right 1 Col: Purchase / Duration Card */}
          <div className="bg-paper border border-line p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 pb-6 border-b border-line">
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="font-body text-xs uppercase tracking-wider text-muted font-semibold">Access Duration</h4>
                  <p className="font-display text-xl text-ink">12 Months Full Access</p>
                  <p className="font-body text-xs text-muted mt-0.5">Includes all course content, updates & resources</p>
                </div>
              </div>

              <div className="py-8 border-b border-line">
                <span className="font-body text-xs uppercase tracking-wider text-muted font-semibold">Tuition & Enrollment</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display text-5xl text-ink">$299</span>
                  <span className="font-body text-sm font-semibold text-muted">USD</span>
                </div>
                <p className="font-body text-xs text-muted mt-2">One-time payment. Instant access granted upon checkout.</p>
              </div>

              {/* Security reassure */}
              <div className="py-4 flex items-center gap-2 text-xs font-body text-muted">
                <span className="text-signal">🔒</span>
                <span>Encrypted payment. Powered by Paymob.</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={`/${locale}/courses/expert-witness-forensic-psychiatry`}
                className="w-full block text-center bg-signal hover:bg-signal-light text-ink font-body font-medium text-sm py-4 px-6 transition-colors shadow-sm"
              >
                Enroll in Course →
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs font-body text-muted/70 uppercase tracking-wider">
                <span>VISA</span>
                <span>•</span>
                <span>Mastercard</span>
                <span>•</span>
                <span>Meeza</span>
                <span>•</span>
                <span>Bank Transfer</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
