import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden bg-ink"
      aria-label="Hero — MedLex"
    >
      {/* ── Geometric background decoration ─────────────────────── */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.07]"
        aria-hidden="true"
      >
        <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
          {[320, 270, 210, 150].map((r) => (
            <circle
              key={r}
              cx="350"
              cy="350"
              r={r}
              stroke="var(--signal)"
              strokeWidth="0.6"
            />
          ))}
          <line
            x1="350"
            y1="30"
            x2="350"
            y2="670"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
          <line
            x1="30"
            y1="350"
            x2="670"
            y2="350"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
          <line
            x1="124"
            y1="124"
            x2="576"
            y2="576"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
          <line
            x1="576"
            y1="124"
            x2="124"
            y2="576"
            stroke="var(--signal)"
            strokeWidth="0.4"
          />
        </svg>
      </div>

      <div
        className="relative mx-auto w-full px-6 pb-24 pt-40 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* ── Left ─────────────────────────────────────────────── */}
          <div>
            {/* Eyebrow label */}
            <div className="mb-10 flex items-center gap-4">
              <span className="block h-px w-12 bg-signal opacity-70" />
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50">
                Forensic &amp; Medicolegal Psychiatry · MENA
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-8 font-display text-5xl leading-[1.1] text-white! lg:text-6xl xl:text-[4.5rem]">
              Where medicine
              <br />
              is asked to <em className="not-italic text-signal">answer</em>
              <br />
              to the court.
            </h1>

            {/* Body */}
            <p className="mb-10 max-w-lg font-body text-base leading-7 text-white/55">
              MedLex trains psychiatrists to produce evaluations that survive
              cross-examination, and gives courts, prosecutors, and ministries
              psychiatric evidence built to a documented standard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/${locale}/register`}
                className="inline-flex items-center gap-2 border border-signal px-7 py-3.5 font-body text-sm tracking-wide text-signal transition-all duration-200 hover:bg-signal hover:text-ink"
              >
                Register your interest
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M2.5 7h9M8.5 3.5L12 7l-3.5 3.5" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/pathways`}
                className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 font-body text-sm tracking-wide text-white/70 transition-all duration-200 hover:border-white/50 hover:text-white"
              >
                The three pathways
              </Link>
            </div>
          </div>

          {/* ── Right ────────────────────────────────────────────── */}
          <div className="relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-none">
            {/* Image frame */}
            <div className="relative aspect-[4/5] border border-white/10 bg-accent/30">
              {/* Decorative crosshair corners */}
              {[
                "top-0 left-0",
                "top-0 right-0",
                "bottom-0 left-0",
                "bottom-0 right-0",
              ].map((pos) => (
                <span
                  key={pos}
                  className={`absolute ${pos} block h-4 w-4 border-signal/60 ${
                    pos.includes("top") && pos.includes("left")
                      ? "border-t border-l"
                      : pos.includes("top")
                        ? "border-t border-r"
                        : pos.includes("left")
                          ? "border-b border-l"
                          : "border-b border-r"
                  }`}
                  aria-hidden="true"
                />
              ))}

              {/* Abstract brain / scales SVG placeholder */}
              <div className="relative h-full w-full">
                <Image
                  src="/images/dr-ahmed-abouelghit.webp"
                  alt="Dr. Ahmed Abouelghit, Consultant Forensic Psychiatrist"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="object-cover object-top grayscale-[15%]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Callout badge */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-5 bg-signal/90 p-5">
              <span className="font-display text-5xl leading-none text-ink">
                3
              </span>
              <p className="font-body text-xs leading-relaxed text-ink/80">
                Educational pathways, one for
                <br />
                each professional audience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade-to-paper */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-ink to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
