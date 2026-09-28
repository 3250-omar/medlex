import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createCollectionPageSchema } from "@/lib/seo/schema";
import {
  createLocalizedMetadata,
  CANONICAL_ORIGIN,
  type Locale,
} from "@/lib/seo/metadata";
import {
  ArrowRight,
  Calendar,
  BookOpen,
  FileText,
  Heart,
  Share2,
} from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPublishedBlogs,
  type PublishedBlogItem,
} from "./_actions/blog-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "blogs");
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "ar";
  const blogs = await getPublishedBlogs();

  const title = isRtl ? "المقالات والتحليلات" : "Articles & Insights";
  const intro = isRtl
    ? "أحدث الرؤى والأوراق التحليلية في الطب النفسي الشرعي والأنظمة الصحية من خبراء ميدليكس."
    : "Original editorial analyses, medicolegal frameworks, and institutional insights from MedLex faculty.";
  const eyebrow = isRtl ? "مدونة ميدليكس" : "MEDLEX EDITORIAL";

  const collectionSchema = createCollectionPageSchema(
    locale,
    "/blogs",
    title,
    intro,
    blogs.map((b) => ({
      name: isRtl && b.title_ar ? b.title_ar : b.title_en,
      url: `${CANONICAL_ORIGIN}/${locale}/blogs/${b.slug}`,
      description: (isRtl && b.excerpt_ar ? b.excerpt_ar : b.excerpt_en) || "",
    })),
  );

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-navy on-navy pb-28 text-lbody">
      <JsonLd data={collectionSchema} />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-20 md:pt-44 md:pb-28 on-navy text-lbody border-b border-white/10">
        {/* Subtle decorative radial glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gold/5 blur-3xl" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)]"
          />
        </div>

        <div className="relative mx-auto w-full px-6 sm:px-10 md:px-14 lg:px-20 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              {eyebrow}
            </span>
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
          </div>

          <h1 className="mt-6 font-serif text-4xl leading-[1.12] text-white md:text-5xl lg:text-6xl font-normal text-balance">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-lbody md:text-lg">
            {intro}
          </p>
        </div>
      </section>

      {/* Blogs Catalog Grid */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 z-10">
        <BlogsData initialBlogs={blogs} isRtl={isRtl} locale={locale} />
      </section>
    </main>
  );
}

function BlogsData({
  initialBlogs,
  locale,
  isRtl,
}: {
  initialBlogs: PublishedBlogItem[];
  locale: string;
  isRtl: boolean;
}) {
  const blogs = initialBlogs;
  const readMore = isRtl ? "اقرأ المقال" : "Read Article";

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-20 px-8 max-w-lg mx-auto bg-deep/60 border border-white/10 rounded-2xl">
        <div className="size-14 bg-gold/10 border border-gold/25 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold">
          <BookOpen className="size-7" />
        </div>
        <h3 className="text-2xl font-serif text-white font-normal mb-3">
          {isRtl ? "المقالات قيد الإعداد" : "Publications in Preparation"}
        </h3>
        <p className="text-lbody/80 text-sm sm:text-base leading-relaxed">
          {isRtl
            ? "يقوم فريق الخبراء بإعداد تحليلات وأوراق معرفية جديدة. تفضل بالزيارة قريباً."
            : "Our faculty is preparing new peer-informed analyses. Please check back shortly."}
        </p>
      </div>
    );
  }

  const defaultAuthor = isRtl ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit";

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {blogs.map((blog, idx) => {
        const isEven = idx % 2 === 0;
        const title = isRtl && blog.title_ar ? blog.title_ar : blog.title_en;
        const excerpt =
          isRtl && blog.excerpt_ar ? blog.excerpt_ar : blog.excerpt_en || "";
        const date = new Date(
          blog.published_at || blog.created_at,
        ).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <article
            key={blog.id}
            className="rounded-2xl border border-white/10 bg-navy2/40 hover:bg-navy2/70 hover:border-gold/30 p-4 sm:p-6 transition-all duration-300 shadow-md group"
          >
            <Link
              href={`/${locale}/blogs/${blog.slug}`}
              className={`flex flex-col ${
                isEven ? "sm:flex-row" : "sm:flex-row-reverse"
              } gap-6 sm:gap-8 items-center justify-between`}
            >
              {/* Compact Thumbnail (Alternating Left / Right) */}
              <div className="w-full sm:w-60 md:w-68 shrink-0 aspect-[16/10] relative rounded-xl overflow-hidden border border-white/10 bg-navy2 shadow-md">
                {blog.cover_image ? (
                  <Image
                    src={blog.cover_image}
                    alt={title || "Blog cover"}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-gradient-to-br from-navy2 to-deep">
                    <FileText className="size-8 text-gold/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-navy/15 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gold">
                  <span className="text-white/90 font-medium">
                    {defaultAuthor}
                  </span>
                  <span className="text-white/20">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 opacity-80" />
                    <span>{date}</span>
                  </div>
                  {blog.seo_tags && blog.seo_tags.length > 0 && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-mute text-[11px] font-sans">
                        {blog.seo_tags[0]}
                      </span>
                    </>
                  )}
                  {Number(blog.likes_count) > 0 && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-mono">
                        <Heart className="size-3 fill-rose-500 text-rose-500" />
                        <span>{blog.likes_count}</span>
                      </span>
                    </>
                  )}
                  {Number(blog.shares_count) > 0 && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="inline-flex items-center gap-1 text-gold/90 text-[11px] font-mono">
                        <Share2 className="size-3" />
                        <span>{blog.shares_count}</span>
                      </span>
                    </>
                  )}
                </div>

                <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-white group-hover:text-gold transition-colors duration-200 leading-snug line-clamp-2">
                  {title}
                </h2>

                <p className="font-sans text-xs sm:text-sm leading-relaxed text-lbody/80 line-clamp-2">
                  {excerpt}
                </p>

                <div className="pt-1.5">
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-semibold text-gold group-hover:text-lgold transition-colors">
                    <span>{readMore}</span>
                    <ArrowRight className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-navy2/40 p-4 sm:p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center"
        >
          <Skeleton className="w-full sm:w-60 aspect-[16/10] rounded-xl bg-white/5 shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <Skeleton className="h-4 w-44 bg-white/5 rounded-full" />
            <Skeleton className="h-6 w-3/4 bg-white/5 rounded-lg" />
            <Skeleton className="h-4 w-full bg-white/5 rounded" />
            <Skeleton className="h-4 w-24 bg-white/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
