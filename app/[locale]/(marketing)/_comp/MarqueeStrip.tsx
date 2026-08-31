const ITEMS = [
  "MEDICO-LEGAL EDUCATION",
  "COURT-READY REPORTING STANDARDS",
  "UK-TRAINED CONSULTANT LEADERSHIP",
  "THE CASC ACADEMY",
  "MEDLEX FOUNDATIONS",
  "CRIMINAL RESPONSIBILITY ASSESSMENT",
  "EXPERT WITNESS TESTIMONY",
  "FORENSIC PSYCHIATRIC EVALUATION",
];

export default function MarqueeStrip() {
  /* Double the array so the marquee loops seamlessly */
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="overflow-hidden border-y border-white/10 bg-accent py-4"
      aria-hidden="true" /* decorative — screen readers skip */
    >
      <div
        className="flex animate-marquee whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-6 font-body text-[10px] uppercase tracking-[0.28em] text-white/50"
          >
            {item}
            <span className="text-signal" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
