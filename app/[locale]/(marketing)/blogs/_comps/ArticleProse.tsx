import { useMemo } from "react";
import { extractYoutubeVideoId } from "./ArticleYoutubeVideo";

interface ArticleProseProps {
  content: string | null;
  isRtl?: boolean;
}

export function normalizeArticleContent(rawHtml: string): string {
  if (!rawHtml) return "";

  // 1. Demote any <h1> in article body to <h2> so the article has strictly one H1 (the title in ArticleHero)
  let processed = rawHtml
    .replace(/<h1(\s+[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");

  // 2. Normalize <h3> to <h2> as required by client guidelines
  processed = processed
    .replace(/<h3(\s+[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h3>/gi, "</h2>");

  // 3. Transform standalone YouTube URLs or paragraph links into responsive iframes
  processed = processed.replace(
    /<p>(?:\s*<a[^>]*href=["']([^"']+)["'][^>]*>.*?<\/a>\s*|\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^\s<]+|youtu\.be\/[a-zA-Z0-9_-]{11}[^\s<]*))\s*)<\/p>/gi,
    (match, p1, p2) => {
      const url = p1 || p2;
      const videoId = extractYoutubeVideoId(url);
      if (!videoId) return match;
      return `<div class="relative w-full aspect-video rounded-xl overflow-hidden my-8 shadow-xl border border-white/10"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="absolute inset-0 w-full h-full" loading="lazy"></iframe></div>`;
    },
  );

  return processed;
}

export function ArticleProse({ content, isRtl = false }: ArticleProseProps) {
  const normalizedHtml = useMemo(
    () => (content ? normalizeArticleContent(content) : ""),
    [content],
  );

  if (!normalizedHtml) return null;

  return (
    <div
      className={`prose-container max-w-[66ch] text-[#e6e9f0] font-serif
        text-[19px] sm:text-[20px] ${isRtl ? "rtl:text-[21px] sm:rtl:text-[22px] leading-[2.0]" : "leading-[1.75]"}
        [&>p]:mb-6 [&>p:empty]:hidden
        ${
          !isRtl
            ? `[&>p:first-of-type::first-letter]:text-[3.6em]
               [&>p:first-of-type::first-letter]:float-start
               [&>p:first-of-type::first-letter]:leading-[0.88]
               [&>p:first-of-type::first-letter]:pe-2.5
               [&>p:first-of-type::first-letter]:text-[#d6b03f]
               [&>p:first-of-type::first-letter]:font-medium`
            : ""
        }
        [&_a]:text-[#e8cd7a] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1 hover:[&_a]:text-white [&_a]:transition-colors
        [&_h1]:font-serif [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-medium [&_h1]:text-[#f3efe4] [&_h1]:mt-10 [&_h1]:mb-4
        [&_h2]:font-serif [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-medium [&_h2]:text-[#f3efe4] [&_h2]:mt-10 [&_h2]:mb-4
        [&_h3]:font-serif [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:font-medium [&_h3]:text-[#f3efe4] [&_h3]:mt-8 [&_h3]:mb-3
        [&_strong]:text-[#f3efe4] [&_strong]:font-semibold
        [&_em]:text-[#e8cd7a] [&_em]:italic
        [&_ul]:list-disc [&_ul]:ms-6 [&_ul]:mb-6 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:ms-6 [&_ol]:mb-6 [&_ol]:space-y-2
        [&_li]:text-[#e6e9f0] [&_li]:leading-relaxed
        [&_blockquote]:border-s-2 [&_blockquote]:border-[#d6b03f] [&_blockquote]:ps-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-[#f3efe4] [&_blockquote]:text-xl
        [&_img]:rounded-xl [&_img]:border [&_img]:border-[#d6b03f]/25 [&_img]:my-8 [&_img]:w-full [&_img]:shadow-xl
        [&_hr]:border-[#d6b03f]/20 [&_hr]:my-10
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:text-[15px] [&_table]:rounded-lg [&_table]:overflow-hidden
        [&_th]:bg-[#1a3558] [&_th]:border [&_th]:border-[#d6b03f]/20 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[#d6b03f]
        [&_td]:border [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-[#e6e9f0] [&_td]:align-top
        [&_tr:nth-child(even)_td]:bg-white/[0.03]
      `}
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}
