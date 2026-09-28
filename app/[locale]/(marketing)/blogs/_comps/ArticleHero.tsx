import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

interface ArticleHeroProps {
  locale: string;
  isRtl?: boolean;
  title: string;
  excerpt?: string | null;
  tags?: string[];
  authorName: string;
  publishedAt?: string | null;
  readingTime: number;
  coverImage?: string | null;
}

function isDrAhmed(name?: string | null): boolean {
  if (!name) return true;
  const lower = name.toLowerCase();
  return (
    lower.includes("ahmed") ||
    lower.includes("abouelghit") ||
    name.includes("أحمد") ||
    name.includes("أبو الغيط")
  );
}

export function ArticleHero({
  locale,
  isRtl = false,
  title,
  excerpt,
  tags = [],
  authorName,
  publishedAt,
  readingTime,
  coverImage,
}: ArticleHeroProps) {
  const isFounder = useMemo(() => isDrAhmed(authorName), [authorName]);

  const formattedDate = useMemo(() => {
    if (!publishedAt) return null;
    try {
      return new Date(publishedAt).toLocaleDateString(
        isRtl ? "ar-EG" : "en-GB",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
    } catch {
      return null;
    }
  }, [publishedAt, isRtl]);

  const initialLetter = useMemo(() => {
    if (isRtl) return "أ";
    return authorName.trim().charAt(0).toUpperCase() || "A";
  }, [isRtl, authorName]);

  return (
    <section
      id="article-hero"
      className="relative min-h-[min(70vh,600px)] flex items-end overflow-hidden pt-28 sm:pt-36 pb-12 sm:pb-16 bg-[#10233f] select-none"
      style={{
        background: `
          radial-gradient(120% 90% at 20% 0%, #3a4a63 0%, transparent 55%),
          radial-gradient(80% 60% at 80% 10%, #2b3a52 0%, transparent 60%),
          linear-gradient(180deg, #1b2a44, #0f1d34)
        `,
      }}
    >
      {/* Decorative cover card (building motif from design) */}
      <div
        aria-hidden="true"
        className="absolute -bottom-[8%] -end-[4%] w-[52%] max-w-[560px] h-[64%] rotate-[-8deg] rtl:rotate-[8deg] opacity-85 rounded-lg overflow-hidden border border-[#d6b03f]/25 shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-0 hidden md:block"
        style={{
          background: coverImage
            ? "transparent"
            : "linear-gradient(160deg, #8a6a3a, #4a3820)",
        }}
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="560px"
            priority
            className="object-cover brightness-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#8a6a3a] to-[#4a3820] flex items-center justify-center p-6 text-center">
            <span className="font-serif text-lg text-white/50 tracking-wider">
              MEDLEX
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero shading gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#0b1a30]/15 via-[#0b1a30]/60 to-[#10233f] z-[1] pointer-events-none"
      />

      {/* Hero Inner Content */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Chips */}
        <div className="flex items-center gap-2 text-sm text-[#a9b6cb] mb-5 flex-wrap">
          <Link
            href={`/${locale}/blogs`}
            className="text-[#e8cd7a] hover:underline underline-offset-4 transition-colors font-medium"
          >
            {isRtl ? "كل المقالات" : "All articles"}
          </Link>
          <span aria-hidden="true" className="text-[#a9b6cb]/50">
            /
          </span>
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="border border-[#d6b03f]/25 px-3 py-0.5 rounded-full text-xs text-[#e8cd7a] bg-[#0b1a30]/60 font-medium"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="border border-[#d6b03f]/25 px-3 py-0.5 rounded-full text-xs text-[#e8cd7a] bg-[#0b1a30]/60 font-medium">
              {isRtl ? "مقالات" : "Articles"}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif font-medium text-3xl sm:text-5xl lg:text-[60px] leading-[1.12] rtl:leading-[1.32] text-[#f3efe4] max-w-[22ch] mb-5 tracking-tight">
          {title}
        </h1>

        {/* Dek / Subtitle */}
        {excerpt && (
          <p className="font-sans text-base sm:text-lg lg:text-[20px] text-[#d3dcea] max-w-[58ch] mb-7 leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="flex items-center gap-3.5 text-sm text-[#a9b6cb] flex-wrap">
          {isFounder ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#d6b03f] shrink-0 shadow-sm bg-[#17305a]">
              <Image
                src="/images/dr-ahmed-abouelghit.webp"
                alt={authorName}
                width={44}
                height={44}
                className="object-cover object-top w-full h-full"
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-full bg-[#17305a] border border-[#d6b03f] flex items-center justify-center font-serif text-[#e8cd7a] text-lg font-semibold shrink-0 shadow-sm"
            >
              {initialLetter}
            </div>
          )}
          <div>
            <strong className="text-[#f3efe4] font-semibold block text-[15px] leading-tight">
              {authorName}
            </strong>
            <span className="text-xs sm:text-sm text-[#a9b6cb]">
              {formattedDate ? `${formattedDate} • ` : ""}
              {readingTime} {isRtl ? "دقيقة قراءة" : "min read"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
