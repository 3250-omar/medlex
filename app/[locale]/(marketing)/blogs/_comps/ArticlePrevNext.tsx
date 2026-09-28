import Link from "next/link";
import { useMemo } from "react";
import type { PublishedBlogItem } from "../_actions/blog-actions";

interface ArticlePrevNextProps {
  prev: PublishedBlogItem | null;
  next: PublishedBlogItem | null;
  locale: string;
  isRtl?: boolean;
}

export function ArticlePrevNext({
  prev,
  next,
  locale,
  isRtl = false,
}: ArticlePrevNextProps) {
  const prevTitle = useMemo(() => {
    if (!prev) return "";
    return isRtl
      ? prev.title_ar || prev.title_en || "مقال"
      : prev.title_en || prev.title_ar || "Article";
  }, [prev, isRtl]);

  const nextTitle = useMemo(() => {
    if (!next) return "";
    return isRtl
      ? next.title_ar || next.title_en || "مقال"
      : next.title_en || next.title_ar || "Article";
  }, [next, isRtl]);

  if (!prev && !next) return null;

  return (
    <nav
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10"
      aria-label="Adjacent articles"
    >
      {prev ? (
        <Link
          href={`/${locale}/blogs/${prev.slug}`}
          className="group block p-5 border border-[#d6b03f]/25 rounded-[14px] bg-[#17305a]/40 hover:border-[#d6b03f] hover:bg-[#17305a]/70 transition-all text-start"
        >
          <small className="flex items-center gap-1.5 text-[#e8cd7a] text-xs font-semibold mb-2 group-hover:text-white transition-colors">
            <svg
              className={`w-4 h-4 stroke-current fill-none ${isRtl ? "rotate-180" : ""}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span>{isRtl ? "السابق" : "Previous"}</span>
          </small>
          <span className="font-serif text-base sm:text-lg text-[#f3efe4] leading-snug line-clamp-2">
            {prevTitle}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next && (
        <Link
          href={`/${locale}/blogs/${next.slug}`}
          className="group block p-5 border border-[#d6b03f]/25 rounded-[14px] bg-[#17305a]/40 hover:border-[#d6b03f] hover:bg-[#17305a]/70 transition-all text-end sm:col-start-2"
        >
          <small className="flex items-center justify-end gap-1.5 text-[#e8cd7a] text-xs font-semibold mb-2 group-hover:text-white transition-colors">
            <span>{isRtl ? "التالي" : "Next"}</span>
            <svg
              className={`w-4 h-4 stroke-current fill-none ${isRtl ? "rotate-180" : ""}`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </small>
          <span className="font-serif text-base sm:text-lg text-[#f3efe4] leading-snug line-clamp-2">
            {nextTitle}
          </span>
        </Link>
      )}
    </nav>
  );
}
