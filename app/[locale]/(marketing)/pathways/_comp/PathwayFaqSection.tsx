import FAQAccordion from "../../_comps/FAQAccordion";
import Eyebrow from "./Eyebrow";

interface PathwayFaqSectionProps {
  faqs: { question: string; answer: string }[];
  eyebrow: string;
  title: string;
}

export default function PathwayFaqSection({
  faqs,
  eyebrow,
  title,
}: PathwayFaqSectionProps) {
  return (
    <section className="bg-[#09192b]">
      <div className="mx-auto  w-full gap-10 px-6 py-20 sm:px-8 lg:max-w-6xl  lg:gap-6 lg:px-10 lg:py-28">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>

        <div className="mt-8">
          <FAQAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
