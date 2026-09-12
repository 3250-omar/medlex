import Link from "next/link";
import { type PathwayContent } from "./pathwayContent";

interface PathwayFounderSectionProps {
  founder: PathwayContent["founder"];
}

export default function PathwayFounderSection({
  founder,
}: PathwayFounderSectionProps) {
  return (
    <section className="border-b border-hair bg-white text-char">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-8 lg:px-10 lg:py-28">
        <p className="kicker text-goldd">{founder.eyebrow}</p>
        <div>
          <h2 className="max-w-2xl font-serif text-3xl font-normal leading-tight text-navy! sm:text-4xl">
            {founder.title}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-char/80 sm:text-lg">
            {founder.body}
          </p>
          <Link
            href="/founder"
            className="mt-8 inline-flex items-center gap-2 border-b-2 border-gold pb-1 font-body text-sm font-semibold text-navy transition-colors hover:text-goldd"
          >
            {founder.action} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
