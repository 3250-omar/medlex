import FAQSection from "../../_comps/FAQSection";

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
    <FAQSection
      id="faq"
      headingId="pathway-faq-heading"
      eyebrow={eyebrow}
      title={title}
      items={faqs}
    />
  );
}
