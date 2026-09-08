import { type PathwayContent } from "./pathwayContent";

interface FormatsSectionProps {
  formats: NonNullable<PathwayContent["formats"]>;
}

export default function FormatsSection({ formats }: FormatsSectionProps) {
  return (
    <section className="border-b border-hair bg-white text-char">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-8 lg:px-10 lg:py-28">
        <p className="kicker text-goldd">{formats.eyebrow}</p>
        <div>
          <h2 className="max-w-2xl font-serif text-3xl font-normal leading-tight text-navy sm:text-4xl">
            {formats.title}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-char/80 sm:text-lg">
            {formats.body}
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {formats.items.map((item) => (
              <article
                key={item.eyebrow}
                className="rounded-2xl border border-hair bg-warm/30 p-7 shadow-sm transition-all duration-300 hover:border-gold/40 hover:bg-white hover:shadow-md"
              >
                <p className="font-body text-xs font-semibold uppercase tracking-[.2em] text-goldd">
                  {item.eyebrow}
                </p>
                <h3 className="mt-4 font-serif text-xl font-normal text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-6 text-char/70">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
