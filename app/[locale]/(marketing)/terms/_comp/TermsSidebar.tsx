"use client";

import { useEffect, useState } from "react";

type SectionLink = {
  id: string;
  num: number;
  title: string;
};

interface TermsSidebarProps {
  sections: SectionLink[];
  title: string;
  backToTopText: string;
}

export default function TermsSidebar({
  sections,
  title,
  backToTopText,
}: TermsSidebarProps) {
  const [activeId, setActiveId] = useState<string>("section-1");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top
              ? prev
              : curr
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: "-120px 0px -65% 0px",
        threshold: [0, 0.2, 0.5],
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(`section-${id}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-28 lg:self-start">
      <div className="space-y-4">
        <div className="rounded-2xl border border-hair bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#EBE5D8]">
            <span className="font-serif text-sm sm:text-base font-bold text-navy! tracking-wide">
              {title}
            </span>
            <span className="text-[11px] font-sans font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
              {sections.length}
            </span>
          </div>

          <nav
            aria-label={title}
            className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1 custom-scrollbar"
          >
            {sections.map((sec) => {
              const isActive = activeId === `section-${sec.id}`;
              return (
                <a
                  key={sec.id}
                  href={`#section-${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={`group flex items-baseline gap-2.5 rounded-lg px-2.5 py-1.5 text-xs sm:text-[13px] transition-all ${
                    isActive
                      ? "bg-navy text-white font-semibold shadow-xs"
                      : "text-char/75 hover:bg-[#FAF8F5] hover:text-navy!"
                  }`}
                >
                  <span
                    className={`font-serif text-xs font-bold shrink-0 transition-colors ${
                      isActive
                        ? "text-gold"
                        : "text-char/40 group-hover:text-gold"
                    }`}
                  >
                    {String(sec.num).padStart(2, "0")}
                  </span>
                  <span className="truncate leading-snug">{sec.title}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-hair bg-white/80 hover:bg-white hover:border-[#DFD5C0] p-2.5 text-xs font-sans font-medium text-char/70 hover:text-navy! transition-all shadow-2xs"
        >
          <svg
            className="size-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span>{backToTopText}</span>
        </button>
      </div>
    </aside>
  );
}
