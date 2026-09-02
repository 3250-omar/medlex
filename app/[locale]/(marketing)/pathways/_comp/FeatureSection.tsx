import Eyebrow from "./Eyebrow";
import { type PathwayContent } from "./pathwayContent";

interface FeatureSectionProps {
  feature: NonNullable<PathwayContent["feature"]>;
}

export default function FeatureSection({ feature }: FeatureSectionProps) {
  return (
    <section className="border-b border-white/10 bg-[#10263d]">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-6 lg:px-10 lg:py-28">
        <Eyebrow>{feature.eyebrow}</Eyebrow>
        <div>
          <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            {feature.title}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/60">
            {feature.body}
          </p>
          {feature.quote && (
            <p className="mt-8 border-s-2 border-signal ps-5 font-display text-xl leading-8 text-white/90">
              {feature.quote}
            </p>
          )}
          {feature.stages && (
            <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {feature.stages.map((stage, index) => (
                <article key={stage.title} className="bg-[#10263d] p-5">
                  <span className="font-body text-[10px] tracking-[.2em] text-signal">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-lg">{stage.title}</h3>
                  <p className="mt-3 font-body text-sm leading-6 text-white/55">
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
