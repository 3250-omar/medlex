import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import FAQAccordion, { type FAQItem } from "./FAQAccordion";

export interface FAQSectionProps {
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  items: FAQItem[];
  children?: ReactNode;
  className?: string;
  headingId?: string;
}

export default function FAQSection({
  id = "faq",
  eyebrow,
  title,
  subtitle,
  items,
  children,
  className,
  headingId,
}: FAQSectionProps) {
  const finalHeadingId = headingId || (id ? `${id}-heading` : undefined);

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-[#fbfaf6] py-20 lg:py-28 border-b border-[#e6e6e0]",
        className,
      )}
      aria-labelledby={title ? finalHeadingId : undefined}
    >
      {/* Background image with fountain pen nib from the HTML prototype */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-no-repeat bg-right rtl:bg-left"
        style={{ backgroundImage: "url('/images/medicolegal/bg_2__faq.jpg')" }}
        aria-hidden="true"
      />

      {/* Warm paper gradient overlay to ensure text is always 100% crisp and legible */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,246,0.97)_0%,rgba(251,250,246,0.92)_55%,rgba(251,250,246,0.45)_100%)] rtl:bg-[linear-gradient(270deg,rgba(251,250,246,0.97)_0%,rgba(251,250,246,0.92)_55%,rgba(251,250,246,0.45)_100%)]"
        aria-hidden="true"
      />

      <div className="relative px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24">
        <div className="mx-auto max-w-4xl">
          {/* Section header (rendered when title or eyebrow is provided) */}
          {(title || eyebrow) && (
            <div className="mb-12 text-center">
              {eyebrow && (
                <div className="inline-flex items-center justify-center gap-3 mb-3">
                  <span className="h-px w-8 bg-gold" aria-hidden="true" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                    {eyebrow}
                  </span>
                  <span className="h-px w-8 bg-gold" aria-hidden="true" />
                </div>
              )}
              {title && (
                <h2
                  id={finalHeadingId}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-navy!"
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-[#555b62] md:text-lg">
                  {subtitle}
                </p>
              )}
              <div className="mt-4 mx-auto h-0.5 w-14 bg-gold" />
            </div>
          )}

          {/* FAQ Accordion list */}
          <FAQAccordion items={items} />

          {/* Optional children (e.g. CTA buttons) */}
          {children && (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
