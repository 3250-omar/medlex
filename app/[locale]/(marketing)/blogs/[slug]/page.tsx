import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAdjacentBlogs } from "../_actions/blog-actions";
import { CANONICAL_ORIGIN } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  createBlogArticleSchema,
  createBlogBreadcrumbSchema,
} from "@/lib/seo/schema";
import { ArticleMiniBar } from "../_comps/ArticleMiniBar";
import { ArticleHero } from "../_comps/ArticleHero";
import { ArticleActionRail } from "../_comps/ArticleActionRail";
import { ArticleProse } from "../_comps/ArticleProse";
import { ArticleGallery } from "../_comps/ArticleGallery";
import { ArticleAuthor } from "../_comps/ArticleAuthor";
import { ArticlePrevNext } from "../_comps/ArticlePrevNext";
import { ArticleCta } from "../_comps/ArticleCta";

function estimateReadingTime(content: string | null): number {
  if (!content) return 3;
  const wordCount = content
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}

function resolveAbsoluteImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `${CANONICAL_ORIGIN}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const isRtl = locale === "ar";
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: isRtl ? "المقال غير موجود" : "Article Not Found",
      description: "Blog not found",
    };
  }

  const articleTitle =
    (isRtl ? blog.title_ar : blog.title_en) ||
    blog.title_en ||
    blog.title_ar ||
    "Article";
  const customSeoTitle = (isRtl ? blog.seo_title_ar : blog.seo_title_en) || "";

  // Guard against generic category names
  const isGenericTitle =
    /^(article|articles|blog|blogs|مقال|مقالات|المقالات)$/i.test(
      customSeoTitle.trim(),
    );
  const resolvedTitle =
    !isGenericTitle && customSeoTitle.trim().length > 0
      ? customSeoTitle.trim()
      : articleTitle;

  const articleExcerpt =
    (isRtl ? blog.excerpt_ar : blog.excerpt_en) ||
    blog.excerpt_en ||
    blog.excerpt_ar ||
    "";
  const customSeoDescription =
    (isRtl ? blog.seo_description_ar : blog.seo_description_en) || "";
  const isGenericDesc =
    /^(article|articles|blog|blogs|مقال|مقالات|المقالات)$/i.test(
      customSeoDescription.trim(),
    );
  const description =
    !isGenericDesc && customSeoDescription.trim().length > 0
      ? customSeoDescription.trim()
      : articleExcerpt;

  const authorName = isRtl ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit";
  const tags = blog.seo_tags || [];
  const primarySection =
    tags[0] || (isRtl ? "الطب النفسي الشرعي" : "Forensic Psychiatry");

  const devOrigin =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : CANONICAL_ORIGIN;

  const explicitOg = resolveAbsoluteImageUrl(blog.og_image_url);
  const explicitCover = resolveAbsoluteImageUrl(blog.cover_image);
  const dynamicOg = `${devOrigin}/api/og?title=${encodeURIComponent(
    resolvedTitle,
  )}&locale=${locale}&type=article&author=${encodeURIComponent(authorName)}${
    primarySection ? `&category=${encodeURIComponent(primarySection)}` : ""
  }`;

  const primaryOgImage = explicitOg
    ? `${devOrigin}/api/og?image=${encodeURIComponent(explicitOg)}`
    : dynamicOg;

  const ogImages = [
    {
      url: primaryOgImage,
      width: 1200,
      height: 630,
      alt: resolvedTitle,
      type: "image/png",
    },
  ];

  if (explicitCover && explicitCover !== explicitOg) {
    ogImages.push({
      url: `${devOrigin}/api/og?image=${encodeURIComponent(explicitCover)}`,
      width: 1200,
      height: 630,
      alt: resolvedTitle,
      type: "image/png",
    });
  }

  return {
    title: resolvedTitle,
    description,
    keywords: tags.length > 0 ? tags : undefined,
    authors: [
      {
        name: authorName,
        url: `${CANONICAL_ORIGIN}/${locale}/founder`,
      },
    ],
    creator: authorName,
    publisher: "MedLex",
    alternates: {
      canonical: `${CANONICAL_ORIGIN}/${locale}/blogs/${slug}`,
      languages: {
        en: `${CANONICAL_ORIGIN}/en/blogs/${slug}`,
        ar: `${CANONICAL_ORIGIN}/ar/blogs/${slug}`,
        "x-default": `${CANONICAL_ORIGIN}/en/blogs/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: isRtl ? "ar_EG" : "en_US",
      url: `${CANONICAL_ORIGIN}/${locale}/blogs/${slug}`,
      siteName: "MedLex",
      title: `${resolvedTitle} | MedLex`,
      description,
      publishedTime: blog.published_at || blog.created_at,
      modifiedTime: blog.updated_at || blog.published_at || blog.created_at,
      authors: [`${CANONICAL_ORIGIN}/${locale}/founder`],
      section: primarySection,
      tags,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${resolvedTitle} | MedLex`,
      description,
      images: [primaryOgImage],
      creator: "@MedLex",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
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

  const title =
    (isRtl ? blog.title_ar : blog.title_en) ||
    blog.title_en ||
    blog.title_ar ||
    "";
  const excerpt = isRtl ? blog.excerpt_ar : blog.excerpt_en;
  const content = isRtl ? blog.content_ar : blog.content_en;
  const tags = blog.seo_tags || [];
  const readingTime = estimateReadingTime(content);
  const authorName = isRtl ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit";

  // Fetch adjacent articles for prev / next navigation
  const { prev, next } = await getAdjacentBlogs(
    blog.published_at || blog.created_at,
    blog.id,
  );

  const articleSchema = createBlogArticleSchema({
    locale,
    slug,
    title,
    excerpt,
    content,
    coverImage: blog.cover_image,
    ogImageUrl: blog.og_image_url,
    publishedAt: blog.published_at,
    updatedAt: blog.updated_at,
    createdAt: blog.created_at,
    tags,
    authorName,
    likesCount: blog.likes_count,
    sharesCount: blog.shares_count,
    viewsCount: blog.views_count,
  });

  const breadcrumbSchema = createBlogBreadcrumbSchema(locale, slug, title);

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Sticky Compact Reading Bar */}
      <ArticleMiniBar title={title} isRtl={isRtl} />

      <main
        className="min-h-screen bg-[#10233f] text-[#f3efe4] pb-24 md:pb-16 font-sans selection:bg-[#d6b03f]/30 selection:text-[#f3efe4]"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Editorial Hero Section */}
        <ArticleHero
          locale={locale}
          isRtl={isRtl}
          title={title}
          excerpt={excerpt}
          tags={tags}
          authorName={authorName}
          publishedAt={blog.published_at || blog.created_at}
          readingTime={readingTime}
          coverImage={blog.cover_image}
        />

        {/* Content Layout Grid */}
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[72px_minmax(0,1fr)] gap-8 lg:gap-12 py-10 sm:py-14">
            {/* Sticky Actions Rail (Desktop & Mobile) */}
            <ArticleActionRail
              blogId={blog.id}
              articleTitle={title}
              initialLikes={blog.likes_count || 0}
              initialShares={blog.shares_count || 0}
              initialViews={blog.views_count || 0}
              isRtl={isRtl}
            />

            {/* Main Article Content & Addons */}
            <article className="min-w-0">
              {/* Formatted Article Body */}
              <ArticleProse content={content} isRtl={isRtl} />

              {/* Photo Gallery with Lightbox */}
              <ArticleGallery
                images={
                  ((blog as { gallery_images?: string[] | null })
                    ?.gallery_images as string[]) || []
                }
                title={title}
                isRtl={isRtl}
              />

              {/* Author Bio Section */}
              <ArticleAuthor authorName={authorName} isRtl={isRtl} />

              {/* Prev / Next Articles Navigation */}
              <ArticlePrevNext
                prev={prev}
                next={next}
                locale={locale}
                isRtl={isRtl}
              />

              {/* Educational Pathways Call-to-Action */}
              <ArticleCta locale={locale} isRtl={isRtl} />
            </article>
          </div>
        </div>
      </main>
    </>
  );
}
