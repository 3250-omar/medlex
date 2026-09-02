import Eyebrow from "./Eyebrow";
import { type PathwayContent } from "./pathwayContent";

interface FormatsSectionProps {
  formats: NonNullable<PathwayContent["formats"]>;
}

export default function FormatsSection({ formats }: FormatsSectionProps) {
  return (
    <section className="border-b border-white/10 bg-[#10263d]">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-6 lg:px-10 lg:py-28">
        <Eyebrow>{formats.eyebrow}</Eyebrow>
        <div>
          <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            {formats.title}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/60">
            {formats.body}
          </p>
          <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-3">
            {formats.items.map((item) => (
              <article
                key={item.eyebrow}
                className="border-b-2 border-transparent bg-[#10263d] p-6 last:border-signal"
              >
                <p className="font-body text-[9px] font-semibold tracking-[.2em] text-signal">
                  {item.eyebrow}
                </p>
                <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-6 text-white/55">
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
