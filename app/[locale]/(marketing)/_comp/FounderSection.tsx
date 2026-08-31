import Link from "next/link";
import Image from "next/image";

interface FounderSectionProps {
  locale: string;
}

const CREDENTIALS = [
  "Consultant Forensic & Medicolegal Psychiatrist",
  "Fellow of the Royal College of Psychiatrists (FRCPsych)",
  "Accredited Royal College CASC Examiner",
  "15+ Years Clinical & Forensic Court Experience",
  "Advisory Consultant to Healthcare Regulators, Courts & Ministries",
  "Practicing in the UK, Egypt, and across the MENA region",
];

const METRICS = [
  {
    title: "Court Appearances",
    desc: "Testified in 200+ complex criminal, civil, and medical negligence cases across UK and MENA jurisdictions.",
  },
  {
    title: "Institutional Advisory",
    desc: "Consulted for 25+ major hospitals, healthcare authorities, judicial bodies, and policy groups.",
  },
  {
    title: "Policy & Guideline Development",
    desc: "Authored benchmark standards for mental health act application and forensic fitness evaluations.",
  },
];

export default function FounderSection({ locale }: FounderSectionProps) {
  return (
    <section className="bg-surface py-24 lg:py-32 border-b border-line" aria-labelledby="founder-heading">
      <div className="mx-auto w-full px-6 md:px-8 lg:px-12" style={{ maxWidth: "var(--content-max)" }}>
        
        {/* Section Header */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8">
          <div className="flex items-start gap-3 pt-1">
            <span className="h-px w-8 bg-signal mt-2" />
            <span className="font-body text-[10px] uppercase tracking-[0.25em] text-muted font-semibold">
              Founder & Expert
            </span>
          </div>
          <div>
            <h2 id="founder-heading" className="font-display text-3xl md:text-4xl lg:text-5xl text-ink">
              Dr. Ahmed M. Hassan
            </h2>
            <p className="mt-4 font-body text-base text-muted max-w-2xl">
              UK-trained Consultant Forensic Psychiatrist bridging medical precision and courtroom scrutiny across international jurisdictions.
            </p>
          </div>
        </div>

        {/* Profile Card & Experience Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Bio card with portrait placeholder & signature */}
          <div className="lg:col-span-5 bg-ink text-white p-8 md:p-10 border border-white/10 relative">
            <div className="aspect-[4/3] bg-accent/40 border border-white/10 mb-8 flex items-center justify-center relative overflow-hidden">
              <Image src="/images/dr-ahmed-abouelghit.webp" alt="Dr. Ahmed Abouelghit, Consultant Forensic Psychiatrist" fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover object-top grayscale-[15%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden="true" />
            </div>

            <h3 className="font-display text-xl text-white mb-4">Qualifications & Appointments</h3>
            <ul className="space-y-3 font-body text-xs text-white/75">
              {CREDENTIALS.map((cred, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-signal text-sm mt-[-2px]">✓</span>
                  <span>{cred}</span>
                </li>
              ))}
            </ul>

            {/* Signature representation */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="font-display text-lg tracking-widest text-signal/80 italic font-serif">A. Hassan</span>
                <span className="block font-body text-[10px] text-white/40 uppercase tracking-widest">Medical Director, MedLex</span>
              </div>
              <Link
                href={`/${locale}/founder`}
                className="font-body text-xs text-signal hover:underline"
              >
                Full Biography →
              </Link>
            </div>
          </div>

          {/* Right: Institutional Experience details */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-8">
            <div>
              <h3 className="font-display text-2xl text-ink mb-6">
                Court &amp; Institutional Authority
              </h3>
              <p className="font-body text-base text-text leading-relaxed mb-8">
                As one of the few forensic psychiatrists actively practicing across both UK and Middle Eastern judicial systems, Dr. Hassan brings direct trial experience to every MedLex curriculum, ensuring cases, questions, and frameworks reflect the reality of current jurisprudence.
              </p>

              <div className="space-y-6">
                {METRICS.map((m, idx) => (
                  <div key={idx} className="p-6 bg-paper border border-line">
                    <h4 className="font-display text-lg text-ink mb-2">{m.title}</h4>
                    <p className="font-body text-sm text-muted leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-2 border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-display text-base text-ink">Seeking Expert Case Consultation?</h5>
                <p className="font-body text-xs text-muted">Available for instructions in criminal and civil matters.</p>
              </div>
              <Link
                href={`/${locale}/contact`}
                className="bg-ink hover:bg-accent text-white font-body text-xs px-6 py-3 uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Instruct Dr. Hassan
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
