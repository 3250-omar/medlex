import InterestButton from "./InterestButton";
import SubscribeButton from "./SubscribeButton";
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
    <section className="border-b border-white/10 bg-navy on-navy text-lbody">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-8 lg:px-10 lg:py-28">
        <p className="kicker text-gold">{programmes.eyebrow}</p>
        <div>
          <h2 className="max-w-2xl font-serif text-3xl font-normal leading-tight text-white sm:text-4xl">
            {programmes.title}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
            {programmes.body}
          </p>
          <div className="mt-12 space-y-16">
            {programmes.items.map((item, index) => (
              <article
                key={item.title}
                className="border-t border-white/10 pt-8"
              >
                <p className="font-body text-xs font-semibold tracking-[.2em] text-gold">
                  {programmeLabel} 0{index + 1}
                </p>
                <h3 className="mt-4 font-serif text-2xl font-normal text-white sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-2xl font-sans leading-7 text-lbody">
                  {item.body}
                </p>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_19rem]">
                  <ul className="space-y-3">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="font-sans text-sm text-lbody/90 before:me-3 before:inline-block before:size-1.5 before:rotate-45 before:bg-gold"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <aside className="rounded-2xl border border-white/10 bg-deep p-6">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-[.2em] text-gold">
                      STATUS
                    </p>
                    <p className="mt-3 font-sans text-sm leading-6 text-white/85">
                      {item.status}
                    </p>
                    <div className="mt-6">
                      {pathway === "casc-academy" ? (
                        <SubscribeButton>{item.action}</SubscribeButton>
                      ) : (
                        <InterestButton pathway={pathway}>
                          {item.action}
                        </InterestButton>
                      )}
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
