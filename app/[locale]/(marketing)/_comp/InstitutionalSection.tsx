import Link from "next/link";

interface InstitutionalSectionProps {
  locale: string;
}

const SERVICES = [
  {
    icon: "⚖️",
    title: "Training & Workshops",
    desc: "Customized institutional forensic curriculums for medical staff, prosecutors, judges, and hospital legal teams.",
  },
  {
    icon: "📋",
    title: "Policy & Protocol Design",
    desc: "Development of clinical governance standards, fitness-to-plead protocols, and risk assessment toolkits.",
  },
  {
    icon: "🏛️",
    title: "Case Consultation & Second Opinions",
    desc: "Independent evaluations, complex criminal responsibility reports, and medicolegal audit services.",
  },
  {
    icon: "🎓",
    title: "Academic Partnerships",
    desc: "Collaborative postgraduate programs and accredited training modules with universities and medical councils.",
  },
];

export default function InstitutionalSection({ locale }: InstitutionalSectionProps) {
  return (
    <section className="bg-paper py-24 border-b border-line" aria-labelledby="institutional-heading">
      <div className="mx-auto w-full px-6 md:px-8 lg:px-12" style={{ maxWidth: "var(--content-max)" }}>
        
        {/* Section Header */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8">
          <div className="flex items-start gap-3 pt-1">
            <span className="h-px w-8 bg-signal mt-2" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              For Organizations
            </span>
          </div>
          <div>
            <h2 id="institutional-heading" className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">
              Institutional Services
            </h2>
            <p className="mt-4 font-body text-base text-muted max-w-2xl">
              Evidence-based solutions for judicial bodies, ministries of health, legal chambers, and healthcare authorities seeking excellence in medicolegal psychiatry.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv, idx) => (
            <div key={idx} className="bg-surface border border-line p-8 flex flex-col justify-between hover:border-signal transition-colors group">
              <div>
                <span className="text-3xl mb-4 block">{srv.icon}</span>
                <h3 className="font-display text-lg text-ink mb-3 group-hover:text-accent transition-colors">
                  {srv.title}
                </h3>
                <p className="font-body text-xs text-muted leading-relaxed">
                  {srv.desc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-line">
                <Link
                  href={`/${locale}/institutional`}
                  className="font-body text-xs font-semibold text-signal hover:text-ink transition-colors inline-flex items-center gap-1"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-ink text-white p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-signal font-semibold">
              Bespoke Engagements
            </span>
            <h3 className="font-display text-2xl text-white mt-1">
              Need a tailored institutional training program or consultation?
            </h3>
            <p className="font-body text-sm text-white/60 mt-2 max-w-xl">
              Our faculty designs bespoke continuous medical and legal education (CME/CLE) programs aligned with your regional jurisdiction.
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="bg-signal hover:bg-signal-light text-ink font-body text-xs uppercase tracking-wider font-semibold px-8 py-4 whitespace-nowrap transition-colors"
          >
            Request Proposal →
          </Link>
        </div>

      </div>
    </section>
  );
}
