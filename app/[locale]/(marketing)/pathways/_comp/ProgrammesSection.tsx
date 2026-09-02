import Eyebrow from "./Eyebrow";
import InterestButton from "./InterestButton";
import { type PathwayContent, type PathwayKey } from "./pathwayContent";

interface ProgrammesSectionProps {
  pathway: PathwayKey;
  programmes: NonNullable<PathwayContent["programmes"]>;
  programmeLabel: string;
}

export default function ProgrammesSection({
  pathway,
  programmes,
  programmeLabel,
}: ProgrammesSectionProps) {
  return (
    <section className="border-b border-white/10 bg-[#10263d]">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-6 lg:px-10 lg:py-28">
        <Eyebrow>{programmes.eyebrow}</Eyebrow>
        <div>
          <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            {programmes.title}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/60">
            {programmes.body}
          </p>
          <div className="mt-12 space-y-16">
            {programmes.items.map((item, index) => (
              <article
                key={item.title}
                className="border-t border-white/10 pt-7"
              >
                <p className="font-body text-[10px] tracking-[.2em] text-signal">
                  {programmeLabel} 0{index + 1}
                </p>
                <h3 className="mt-4 font-display text-3xl">{item.title}</h3>
                <p className="mt-4 max-w-2xl font-body leading-7 text-white/60">
                  {item.body}
                </p>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_19rem]">
                  <ul className="space-y-3">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="font-body text-sm text-white/70 before:me-3 before:inline-block before:size-1.5 before:rotate-45 before:bg-signal"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <aside className="border border-white/10 bg-white/5 p-5">
                    <p className="font-body text-[9px] tracking-[.2em] text-white/45">
                      STATUS
                    </p>
                    <p className="mt-4 font-body text-sm leading-6 text-white/75">
                      {item.status}
                    </p>
                    <div className="mt-5">
                      <InterestButton pathway={pathway}>
                        {item.action}
                      </InterestButton>
                    </div>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
