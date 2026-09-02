import Link from "next/link";
import Eyebrow from "./Eyebrow";
import { type PathwayContent } from "./pathwayContent";

interface PathwayFounderSectionProps {
  founder: PathwayContent["founder"];
}

export default function PathwayFounderSection({
  founder,
}: PathwayFounderSectionProps) {
  return (
    <section className="border-b border-white/10 bg-[#09192b]">
      <div className="mx-auto grid w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl lg:grid-cols-[10rem_1fr] lg:gap-6 lg:px-10 lg:py-28">
        <Eyebrow>{founder.eyebrow}</Eyebrow>
        <div>
          <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            {founder.title}
          </h2>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/60">
            {founder.body}
          </p>
          <Link
            href="/founder"
            className="mt-9 inline-flex border-b border-signal pb-1 font-body text-sm text-signal hover:text-signal-light"
          >
            {founder.action}{" "}
            <span className="ms-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
