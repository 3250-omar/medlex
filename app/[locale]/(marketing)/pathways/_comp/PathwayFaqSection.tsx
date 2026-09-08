import FAQAccordion from "../../_comps/FAQAccordion";

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
    <section className="border-b border-white/10 bg-navy on-navy text-lbody">
      <div className="mx-auto w-full px-6 py-20 sm:px-8 lg:max-w-6xl lg:px-10 lg:py-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-serif text-3xl font-normal text-white sm:text-4xl">
            {title}
          </h2>
          <p className="kicker text-gold">{eyebrow}</p>
        </div>

        <div className="mt-10">
          <FAQAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
