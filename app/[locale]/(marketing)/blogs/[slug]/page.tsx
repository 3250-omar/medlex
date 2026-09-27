import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogBySlug } from "../_actions/blog-actions";
import { CANONICAL_ORIGIN } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { ReadingProgressBar } from "../_comps/ReadingProgressBar";
import { ShareButtons } from "../_comps/ShareButtons";
import { ArticleGalleryCarousel } from "../_comps/ArticleGalleryCarousel";

function estimateReadingTime(content: string | null): number {
  if (!content) return 3;
  const wordCount = content
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Not Found",
      description: "Blog not found",
    };
  }

  const title =
    locale === "ar"
      ? blog.seo_title_ar || blog.title_ar
      : blog.seo_title_en || blog.title_en;
  const description =
    locale === "ar"
      ? blog.seo_description_ar || blog.excerpt_ar
      : blog.seo_description_en || blog.excerpt_en;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      url: `${CANONICAL_ORIGIN}/${locale}/blogs/${slug}`,
      siteName: "MedLex",
      title,
      description,
      images: blog.og_image_url
        ? [blog.og_image_url]
        : blog.cover_image
          ? [blog.cover_image]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.og_image_url
        ? [blog.og_image_url]
        : blog.cover_image
          ? [blog.cover_image]
          : [],
    },
    alternates: {
      canonical: `${CANONICAL_ORIGIN}/${locale}/blogs/${slug}`,
      languages: {
        en: `${CANONICAL_ORIGIN}/en/blogs/${slug}`,
        ar: `${CANONICAL_ORIGIN}/ar/blogs/${slug}`,
        "x-default": `${CANONICAL_ORIGIN}/en/blogs/${slug}`,
      },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isRtl = locale === "ar";
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const title = isRtl ? blog.title_ar : blog.title_en;
  const excerpt = isRtl ? blog.excerpt_ar : blog.excerpt_en;
  const content = isRtl ? blog.content_ar : blog.content_en;
  const tags = blog.seo_tags || [];
  const readingTime = estimateReadingTime(content);

  const authorName = isRtl ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: blog.og_image_url || blog.cover_image || [],
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "MedLex",
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_ORIGIN}/icon.png`,
      },
    },
    ...(tags.length > 0 && { keywords: tags.join(", ") }),
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <ReadingProgressBar />

      <main
        className="relative isolate min-h-screen overflow-hidden bg-navy on-navy pb-32 pt-32 sm:pt-40 text-lbody"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Subtle decorative radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.07),transparent_70%)]"
        />

        <article className="relative mx-auto w-full px-6 sm:px-8 lg:max-w-5xl lg:px-8 z-10">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
            <Link
              href={`/${locale}/blogs`}
              className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-gold hover:text-lgold transition-colors group"
            >
              {isRtl ? (
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              ) : (
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              )}
              <span>
                {isRtl ? "العودة إلى كافة المقالات" : "Back to All Articles"}
              </span>
            </Link>

            <ShareButtons title={title} isRtl={isRtl} />
          </div>

          {/* Article Header (Clean Editorial Style) */}
          <header className="mb-10 sm:mb-12">
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/20"
                  >
                    <Tag className="size-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.18] text-white text-balance tracking-tight mb-5">
              {title}
            </h1>

            {excerpt && (
              <p className="font-sans text-base sm:text-lg text-lbody/80 leading-relaxed mb-6 text-balance">
                {excerpt}
              </p>
            )}

            {/* Author Byline & Published Meta (Simple, clean row) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-mute border-y border-white/10 py-3.5">
              <span className="font-medium text-white">{authorName}</span>

              {(blog.published_at || blog.created_at) && (
                <>
                  <span className="text-white/20">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-gold/80" />
                    <time dateTime={blog.published_at || blog.created_at}>
                      {new Date(
                        blog.published_at || blog.created_at,
                      ).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </>
              )}

              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-gold/80" />
                <span>
                  {readingTime} {isRtl ? "دقائق قراءة" : "min read"}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Cover Media */}
          {blog.cover_image && (
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-12 sm:mb-16 bg-deep">
              <Image
                src={blog.cover_image}
                alt={title || "Blog cover"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Main Article Body (Flowing naturally within optimal reading measure ~860px - NO CARD BOX) */}
          <div
            className="mx-auto max-w-[860px] text-lbody font-sans text-base sm:text-[17px] leading-relaxed
              [&_p]:mb-3.5 [&_p]:leading-relaxed [&_p]:text-lbody/90 [&_p:empty]:hidden
              [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-normal [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:leading-snug
              [&_h2]:font-serif [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-normal [&_h2]:text-white [&_h2]:mt-7 [&_h2]:mb-2.5 [&_h2]:leading-snug [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2
              [&_h3]:font-serif [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-normal [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
              [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-lgold [&_a]:transition-colors
              [&_strong]:text-white [&_strong]:font-semibold
              [&_em]:text-lgold [&_em]:italic
              [&_ul]:list-disc [&_ul]:ms-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:ms-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
              [&_li]:text-lbody/90 [&_li]:leading-relaxed
              [&_blockquote]:border-s-3 [&_blockquote]:border-gold [&_blockquote]:ps-5 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:font-serif [&_blockquote]:text-lg sm:[&_blockquote]:text-xl [&_blockquote]:text-white [&_blockquote]:leading-relaxed
              [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10 [&_img]:my-8 [&_img]:w-full [&_img]:shadow-xl
              [&_.article-gallery]:grid [&_.article-gallery]:grid-cols-1 sm:[&_.article-gallery]:grid-cols-2 [&_.article-gallery]:gap-4.5 [&_.article-gallery]:my-8
              [&_.image-grid]:grid [&_.image-grid]:grid-cols-1 sm:[&_.image-grid]:grid-cols-2 [&_.image-grid]:gap-4.5 [&_.image-grid]:my-8
              [&_p:has(img+img)]:grid [&_p:has(img+img)]:grid-cols-1 sm:[&_p:has(img+img)]:grid-cols-2 [&_p:has(img+img)]:gap-4.5 [&_p:has(img+img)]:my-8
              [&_p:has(img+img)_img]:my-0 [&_p:has(img+img)_img]:w-full [&_p:has(img+img)_img]:aspect-[4/3] [&_p:has(img+img)_img]:object-cover
              [&_pre]:bg-deep [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6
              [&_code]:text-gold [&_code]:font-mono [&_code]:text-sm [&_code]:bg-deep/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
              [&_hr]:border-white/10 [&_hr]:my-8"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />

          {/* Article Photo Gallery Carousel (Shadcn Embla Carousel) */}
          <ArticleGalleryCarousel
            images={
              ((blog as { gallery_images?: string[] | null })
                ?.gallery_images as string[]) || []
            }
            title={title}
            isRtl={isRtl}
          />

          {/* Article Footer & Author Signature */}
          <footer className="mx-auto max-w-[860px] mt-16 pt-10 border-t border-white/10 space-y-12">
            {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-mute">
                <span>{isRtl ? "الكاتب" : "Author"}: </span>
                <span className="text-white font-medium">{authorName}</span>
              </div>
              <ShareButtons title={title} isRtl={isRtl} />
            </div> */}

            {/* Educational Pathways Next Step */}
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-deep via-navy2/50 to-deep p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
              <div className="max-w-md">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {isRtl ? "مؤسسة ميدليكس التعليمية" : "MEDLEX ACADEMY"}
                </span>
                <h3 className="font-serif text-2xl font-normal text-white mt-2">
                  {isRtl
                    ? "هل ترغب في تعميق خبرتك الطبية القانونية؟"
                    : "Advance your medicolegal & clinical practice"}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-lbody/80 mt-2 leading-relaxed">
                  {isRtl
                    ? "استكشف مساراتنا التعليمية المتخصصة في كتابة التقارير للمحاكم، واجتياز CASC، والقيادة المؤسسية."
                    : "Explore our founder-led pathways in expert witness court reporting, CASC examination mastery, and institutional leadership."}
                </p>
              </div>
              <Link
                href={`/${locale}/courses`}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gold hover:bg-lgold text-navy font-semibold px-5 py-3 text-sm transition-colors shadow-sm self-start sm:self-auto"
              >
                <span>{isRtl ? "استكشف البرامج" : "Explore Courses"}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
