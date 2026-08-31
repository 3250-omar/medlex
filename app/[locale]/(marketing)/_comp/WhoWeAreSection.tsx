const AUDIENCES = [
  { bold: "Psychiatrists", rest: " seeking forensic competence" },
  { bold: "Courts", rest: " and judges" },
  { bold: "Prosecution", rest: " offices" },
  { bold: "Ministries", rest: " & public institutions" },
  { bold: "Legal counsel", rest: "" },
];

export default function WhoWeAreSection() {
  return (
    <section
      className="bg-paper py-24 lg:py-32"
      aria-labelledby="who-we-are-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* ── Top: label + serif pull-headline ─────────────────── */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr] lg:gap-16">
          {/* Label */}
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-signal" />
            <span className="font-body text-[9px] uppercase tracking-[0.25em] text-muted">
              Who We Are
            </span>
          </div>

          {/* Pull headline + intro */}
          <div>
            <h2
              id="who-we-are-heading"
              className="font-display text-3xl leading-snug text-ink lg:text-4xl xl:text-5xl"
            >
              A clinical opinion and a legal finding are not the same document.
            </h2>
            <p className="mt-5 max-w-xl font-body text-base leading-7 text-muted">
              Most psychiatric reports entering court were never written for court.
              MedLex exists to close that gap – from both ends.
            </p>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left: copy + audiences */}
          <div className="space-y-5">
            <p className="font-body text-[15px] leading-7 text-text">
              MedLex Solutions is the first specialised forensic psychiatry training
              and consultation centre in the MENA region. We work along two lines
              that reinforce each other: structured training that equips psychiatrists
              with the forensic competence courts expect, and expert consultation that
              gives judicial and governmental institutions evaluations they can rely on.
            </p>
            <p className="font-body text-[15px] leading-7 text-text">
              The method is deliberately unglamorous — defined questions, documented
              reasoning, traceable sources, and conclusions stated at the confidence
              the evidence actually supports. That structure is what makes an opinion
              admissible, and it is also what protects the clinician who signed it.
            </p>
            <p className="font-body text-[15px] leading-7 text-text">
              We are not importing a model wholesale. Programmes are built around the
              legal frameworks practitioners here actually appear under, then aligned
              with international forensic standards rather than the other way round.
            </p>

            {/* Audience tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {AUDIENCES.map((a) => (
                <span
                  key={a.bold}
                  className="border border-line px-3 py-1.5 font-body text-sm text-text"
                >
                  <strong className="font-semibold text-ink">{a.bold}</strong>
                  {a.rest}
                </span>
              ))}
            </div>
          </div>

          {/* Right: image + pull-quote + mini-stats */}
          <div>
            {/* Image placeholder */}
            <div className="mb-0 flex aspect-[4/3] items-center justify-center border border-line bg-surface-2">
              <svg
                viewBox="0 0 300 225"
                fill="none"
                className="w-40 opacity-20"
                aria-hidden="true"
              >
                <circle cx="150" cy="100" r="60" stroke="var(--accent)" strokeWidth="0.8" />
                <path d="M150 40 L150 185" stroke="var(--accent)" strokeWidth="0.8" />
                <path d="M90 130 L210 130" stroke="var(--accent)" strokeWidth="0.8" />
                <circle cx="90" cy="145" r="12" stroke="var(--accent)" strokeWidth="0.6" />
                <circle cx="210" cy="145" r="12" stroke="var(--accent)" strokeWidth="0.6" />
                <path d="M90 115 Q120 90 150 115 Q180 140 210 115" stroke="var(--signal)" strokeWidth="0.6" fill="none" />
              </svg>
            </div>

            {/* Pull-quote */}
            <div className="border-l-2 border-signal bg-accent p-8">
              <blockquote className="font-display text-lg italic leading-snug text-white lg:text-xl">
                &ldquo;We&apos;re not just training psychiatrists &ndash; we&apos;re building the
                professional standard where clinical expertise becomes
                court-admissible evidence.&rdquo;
              </blockquote>
              <cite className="mt-4 block font-body text-[9px] not-italic uppercase tracking-[0.2em] text-white/45">
                Mission · MedLex Solutions
              </cite>
            </div>

            {/* Mini stats */}
            <div className="flex divide-x divide-line border border-line">
              {[
                {
                  value: "UK",
                  detail: "Consultant training and practice\nin forensic psychiatry.",
                },
                {
                  value: "3",
                  detail: "Countries of practice: the United\nKingdom, Egypt, and Qatar.",
                },
              ].map((s) => (
                <div key={s.value} className="flex-1 px-6 py-6 text-center">
                  <span className="block font-display text-4xl text-ink">{s.value}</span>
                  <p className="mt-2 whitespace-pre-line font-body text-xs leading-relaxed text-muted">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
