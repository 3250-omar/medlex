import Eyebrow from "./Eyebrow";
import { type PathwayContent } from "./pathwayContent";

interface AudienceSectionProps {
  audience: PathwayContent["audience"];
}

export default function AudienceSection({ audience }: AudienceSectionProps) {
  return (
    <section className="border-b border-white/10 bg-[#09192b]">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-6 lg:px-10 lg:py-28">
        <Eyebrow>{audience.eyebrow}</Eyebrow>
        <div>
          <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            {audience.title}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/60">
            {audience.body}
          </p>
          {audience.items.length > 0 && (
            <div className="mt-10 grid gap-x-12 md:grid-cols-2">
              {audience.items.map((item) => (
                <article
                  key={item.title}
                  className="border-t border-white/10 py-6"
                >
                  <h3 className="font-display text-lg before:me-4 before:inline-block before:size-2 before:rotate-45 before:bg-signal">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-6 text-white/55">
                    {item.body}
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
