import Link from "next/link";

const PATHWAYS = [
  {
    num: "PATHWAY 01",
    title: "Medico-Legal Education",
    audience: "For psychiatrists, psychologists & legal professionals",
    audienceClass: "text-signal",
    description:
      "Four progressive tracks – from single-topic masterclasses to advanced certification – home of the flagship programme, Writing Psychiatric Evidence.",
    features: [
      { icon: "◆", text: "Live interactive online", active: true },
      { icon: "◆", text: "Bilingual EN · AR", active: true },
      { icon: "□", text: "Waitlist open", active: false },
    ],
    href: "/pathways/medico-legal",
  },
  {
    num: "PATHWAY 02",
    title: "The CASC Academy",
    audience: "For MRCPsych CASC candidates worldwide",
    audienceClass: "text-white/55",
    description:
      "An interactive digital preparation platform that mirrors the real examination – designed by an accredited Royal College CASC examiner.",
    features: [
      { icon: "◆", text: "Self-paced online", active: true },
      { icon: "◆", text: "English only", active: true },
      { icon: "◆", text: "First to launch · ready", active: true },
    ],
    href: "/pathways/casc-academy",
  },
  {
    num: "PATHWAY 03",
    title: "MedLex Foundations",
    audience: "For clinicians building careers beyond the clinic",
    audienceClass: "text-white/55",
    description:
      "Professional development beyond clinical training – opening with The Clinician's Edge and the Clinical Leadership Programme.",
    features: [
      { icon: "□", text: "Online & face-to-face", active: false },
      { icon: "□", text: "Bilingual EN · AR", active: false },
      { icon: "□", text: "First programmes launching", active: false },
    ],
    href: "/pathways/foundations",
  },
] as const;

interface PathwaysSectionProps {
  locale: string;
}

export default function PathwaysSection({ locale }: PathwaysSectionProps) {
  return (
    <section
      className="bg-ink py-24 lg:py-32"
      aria-labelledby="pathways-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* ── Section header ───────────────────────────────────── */}
        <div data-reveal className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr] lg:gap-16">
          <div className="flex items-start gap-4 pt-1">
            <span className="mt-2 block h-px w-10 shrink-0 bg-signal opacity-70" />
            <span className="font-body text-[9px] uppercase leading-relaxed tracking-[0.25em] text-white/35">
              Three Educational
              <br />
              Pathways
            </span>
          </div>
          <div>
            <h2
              id="pathways-heading"
              className="font-display text-3xl text-white lg:text-5xl"
            >
              One platform. Three ways in.
            </h2>
            <p className="mt-4 max-w-lg font-body text-base text-white/45">
              Each pathway has its own audience, its own pace, and its own next
              step. Choose the way in that belongs to you.
            </p>
          </div>
        </div>

        {/* ── Cards ─────────────────────────────────────────────── */}
        <div data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-3">
          {PATHWAYS.map((p) => (
            <article
              key={p.num}
              className="flex flex-col gap-6 bg-ink p-8 transition-colors duration-300 hover:bg-accent/40"
            >
              <div>
                <span className="mb-4 block font-body text-[9px] uppercase tracking-[0.3em] text-white/30">
                  {p.num}
                </span>
                <h3 className="mb-2 font-display text-xl text-white">{p.title}</h3>
                <p className={`font-body text-xs ${p.audienceClass}`}>
                  {p.audience}
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <p className="flex-1 font-body text-sm leading-6 text-white/55">
                {p.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {p.features.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-2 font-body text-xs"
                  >
                    <span
                      className={f.active ? "text-signal" : "text-white/25"}
                      aria-hidden="true"
                    >
                      {f.icon}
                    </span>
                    <span className={f.active ? "text-white/75" : "text-white/40"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}${p.href}`}
                className="mt-auto inline-flex items-center gap-2 font-body text-xs tracking-wide text-white/40 transition-colors hover:text-signal"
              >
                View Pathway
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M2 6h8M7 2.5l3.5 3.5L7 9.5" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
