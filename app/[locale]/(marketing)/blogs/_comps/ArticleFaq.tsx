import FAQAccordion, { type FAQItem } from "@/app/[locale]/(marketing)/_comps/FAQAccordion";

interface ArticleFaqProps {
  items?: FAQItem[] | null;
  isRtl?: boolean;
}

export function ArticleFaq({ items, isRtl = false }: ArticleFaqProps) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  // Filter out any empty entries just in case
  const validItems = items.filter(
    (item) => item && item.question?.trim() && item.answer?.trim()
  );

  if (validItems.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-14 pt-10 border-t border-[#d6b03f]/25"
      aria-label={isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
    >
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="h-px w-6 bg-[#d6b03f]" aria-hidden="true" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d6b03f]">
            {isRtl ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f3efe4]">
          {isRtl ? "أسئلة شائعة حول المقال" : "Frequently Asked Questions"}
        </h2>
      </div>

      <FAQAccordion items={validItems} theme="dark" />
    </section>
  );
}
