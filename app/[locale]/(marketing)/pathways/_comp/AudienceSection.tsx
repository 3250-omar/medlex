import { type PathwayContent } from "./pathwayContent";

interface AudienceSectionProps {
  audience: PathwayContent["audience"];
}

export default function AudienceSection({ audience }: AudienceSectionProps) {
  return (
    <section className="border-b border-hair bg-white text-char">
      <div className="mx-auto grid w-full gap-8 px-6 py-16 sm:px-8 sm:py-20 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-8 lg:px-10 lg:py-24">
        <p className="kicker text-goldd">{audience.eyebrow}</p>
        <div>
          <h2 className="max-w-2xl font-serif text-3xl font-normal leading-tight text-navy! sm:text-4xl">
            {audience.title}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-char/80 sm:text-lg">
            {audience.body}
          </p>
          {audience.items.length > 0 && (
            <div className="mt-12 grid gap-x-12 md:grid-cols-2">
              {audience.items.map((item) => (
                <article
                  key={item.title}
                  className="border-t border-hair py-6"
                >
                  <h3 className="font-serif text-xl font-normal text-navy before:me-4 before:inline-block before:size-2 before:rotate-45 before:bg-gold">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-6 text-char/70">
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
