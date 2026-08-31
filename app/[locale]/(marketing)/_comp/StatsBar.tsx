const STATS = [
  {
    value: "15+",
    label: "Years of Practice",
    detail: "Forensic & Medicolegal\nPsychiatry",
  },
  {
    value: "200+",
    label: "Court Appearances",
    detail: "Regional & International\nJurisdictions",
  },
  {
    value: "25+",
    label: "Institutions Advised",
    detail: "Hospitals, Universities &\nGovernment Bodies",
  },
  {
    value: "12K+",
    label: "Learners Worldwide",
    detail: "Professionals from 60+\nCountries",
  },
  {
    value: "3",
    label: "Specialized Pathways",
    detail: "Structured. Evidence-Based.\nCareer-Defining.",
  },
] as const;

export default function StatsBar() {
  return (
    <section
      className="border-b border-line bg-surface"
      aria-label="Key statistics"
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--content-max)" }}
      >
        <dl className="grid grid-cols-2 divide-x divide-line md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "flex flex-col items-center px-6 py-10 text-center",
                /* last card spans 2 cols on md grid, 1 on lg */
                i === 4 ? "col-span-2 md:col-span-1" : "",
              ].join(" ")}
            >
              <dt className="order-2 mt-1 font-body text-[9px] uppercase tracking-[0.2em] text-muted">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-4xl text-ink">
                {stat.value}
              </dd>
              <p className="order-3 mt-2 whitespace-pre-line font-body text-[11px] leading-relaxed text-muted/60">
                {stat.detail}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
