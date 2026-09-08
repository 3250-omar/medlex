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

export default function InstitutionalSection({
  locale,
}: InstitutionalSectionProps) {
  return (
    <section
      className="bg-white py-24 border-b border-hair text-char"
      aria-labelledby="institutional-heading"
    >
      <div
        className="mx-auto w-full px-6 md:px-8 lg:px-12"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Section Header */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8">
          <div className="flex items-start gap-3 pt-1">
            <span className="kicker text-goldd">For Organizations</span>
          </div>
          <div>
            <h2
              id="institutional-heading"
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy font-normal"
            >
              Institutional Services
            </h2>
            <p className="mt-4 font-sans text-base text-char/80 max-w-2xl leading-relaxed">
              Evidence-based solutions for judicial bodies, ministries of
              health, legal chambers, and healthcare authorities seeking
              excellence in medicolegal psychiatry.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-warm/30 border border-hair p-8 flex flex-col justify-between hover:border-gold/40 hover:-translate-y-1 hover:shadow-md transition-all group"
            >
              <div>
                <span className="text-3xl mb-4 block">{srv.icon}</span>
                <h3 className="font-serif text-xl text-navy mb-3 group-hover:text-goldd transition-colors font-normal">
                  {srv.title}
                </h3>
                <p className="font-sans text-sm text-char/75 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-hair">
                <Link
                  href={`/${locale}/institutional`}
                  className="font-body text-xs font-semibold text-navy hover:text-goldd transition-colors inline-flex items-center gap-1"
                >
                  Learn More <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-2xl bg-deep text-lbody p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div>
            <span className="kicker text-gold font-semibold">
              Bespoke Engagements
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-2">
              Need a tailored institutional training program or consultation?
            </h3>
            <p className="font-sans text-sm text-lbody mt-2 max-w-xl">
              Our faculty designs bespoke continuous medical and legal education
              (CME/CLE) programs aligned with your regional jurisdiction.
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="btn btn-gold !rounded-full !px-8 !py-4 font-body text-xs uppercase tracking-wider font-semibold text-navy whitespace-nowrap"
          >
            Request Proposal →
          </Link>
        </div>
      </div>
    </section>
  );
}
