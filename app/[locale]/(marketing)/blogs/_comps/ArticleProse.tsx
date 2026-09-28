interface ArticleProseProps {
  content: string | null;
  isRtl?: boolean;
}

export function ArticleProse({ content, isRtl = false }: ArticleProseProps) {
  if (!content) return null;

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
      `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
