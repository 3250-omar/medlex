import { type PathwayContent } from "./pathwayContent";

interface FeatureSectionProps {
  feature: NonNullable<PathwayContent["feature"]>;
}

export default function FeatureSection({ feature }: FeatureSectionProps) {
  return (
    <section className="border-b border-white/10 bg-navy on-navy text-lbody">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-8 lg:px-10 lg:py-28">
        <p className="kicker text-gold">{feature.eyebrow}</p>
        <div>
          <h2 className="max-w-2xl font-serif text-3xl font-normal leading-tight text-white sm:text-4xl">
            {feature.title}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
            {feature.body}
          </p>
          {feature.quote && (
            <p className="mt-8 border-s-2 border-gold ps-5 font-serif text-xl italic leading-8 text-white/95">
              {feature.quote}
            </p>
          )}
          {feature.stages && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {feature.stages.map((stage, index) => (
                <article
                  key={stage.title}
                  className="rounded-2xl border border-white/10 bg-deep p-6 transition-all duration-300 hover:border-gold/30"
                >
                  <span className="font-body text-xs font-semibold tracking-[.2em] text-gold">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-normal text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-6 text-mute">
                    {stage.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
