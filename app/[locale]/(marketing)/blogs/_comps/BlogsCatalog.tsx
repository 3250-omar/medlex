"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  FileText,
  Heart,
  Share2,
  Eye,
  ArrowRight,
} from "lucide-react";
import type { PublishedBlogItem } from "../_actions/blog-actions";

interface BlogsCatalogProps {
  initialBlogs: PublishedBlogItem[];
  locale: string;
  isRtl: boolean;
}

export function BlogsCatalog({
  initialBlogs,
  locale,
  isRtl,
}: BlogsCatalogProps) {
  const [activeTab, setActiveTab] = useState<"all" | "casc" | "medico-legal">(
    "all",
  );

  const defaultAuthor = isRtl ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit";
  const readMore = isRtl ? "اقرأ المقال" : "Read Article";

  const counts = useMemo(() => {
    return {
      all: initialBlogs.length,
      casc: initialBlogs.filter(
        (b) => (b.category || "casc").toLowerCase() === "casc",
      ).length,
      "medico-legal": initialBlogs.filter(
        (b) => b.category?.toLowerCase() === "medico-legal",
      ).length,
    };
  }, [initialBlogs]);

  const filteredBlogs = useMemo(() => {
    if (activeTab === "all") return initialBlogs;
    return initialBlogs.filter(
      (b) => (b.category || "casc").toLowerCase() === activeTab,
    );
  }, [initialBlogs, activeTab]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Category Filter Tabs */}
      <div
        className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
        role="tablist"
        aria-label={isRtl ? "تصنيفات المقالات" : "Article Categories"}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-[#d6b03f] text-[#0b1a30] font-semibold shadow-md"
              : "border border-white/15 text-[#f3efe4]/80 hover:text-[#f3efe4] hover:border-[#d6b03f]/50 bg-white/5"
          }`}
        >
          <span>{isRtl ? "جميع المقالات" : "All Articles"}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === "all"
                ? "bg-[#0b1a30]/20 text-[#0b1a30]"
                : "bg-white/10 text-white/70"
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "casc"}
          onClick={() => setActiveTab("casc")}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "casc"
              ? "bg-[#d6b03f] text-[#0b1a30] font-semibold shadow-md"
              : "border border-white/15 text-[#f3efe4]/80 hover:text-[#f3efe4] hover:border-[#d6b03f]/50 bg-white/5"
          }`}
        >
          <span>{isRtl ? "أكاديمية CASC" : "CASC Academy"}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === "casc"
                ? "bg-[#0b1a30]/20 text-[#0b1a30]"
                : "bg-white/10 text-white/70"
            }`}
          >
            {counts.casc}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "medico-legal"}
          onClick={() => setActiveTab("medico-legal")}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activeTab === "medico-legal"
              ? "bg-[#d6b03f] text-[#0b1a30] font-semibold shadow-md"
              : "border border-white/15 text-[#f3efe4]/80 hover:text-[#f3efe4] hover:border-[#d6b03f]/50 bg-white/5"
          }`}
        >
          <span>{isRtl ? "الطب النفسي القضائي" : "Medico-Legal"}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === "medico-legal"
                ? "bg-[#0b1a30]/20 text-[#0b1a30]"
                : "bg-white/10 text-white/70"
            }`}
          >
            {counts["medico-legal"]}
          </span>
        </button>
      </div>

      {/* Articles Listing */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 px-8 max-w-lg mx-auto bg-deep/60 border border-white/10 rounded-2xl">
          <div className="size-14 bg-gold/10 border border-gold/25 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold">
            <BookOpen className="size-7" />
          </div>
          <h3 className="text-2xl font-serif text-white font-normal mb-3">
            {isRtl
              ? "لا توجد مقالات في هذا القسم حالياً"
              : "No articles found in this category"}
          </h3>
          <p className="text-lbody/80 text-sm sm:text-base leading-relaxed">
            {isRtl
              ? "يقوم فريق الخبراء بإعداد أوراق معرفية جديدة في هذا التخصص. تفضل بالزيارة قريباً."
              : "Our faculty is preparing new articles for this category. Please check back shortly."}
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {filteredBlogs.map((blog, idx) => {
            const isEven = idx % 2 === 0;
            const title =
              isRtl && blog.title_ar ? blog.title_ar : blog.title_en;
            const excerpt =
              isRtl && blog.excerpt_ar
                ? blog.excerpt_ar
                : blog.excerpt_en || "";
            const date = new Date(
              blog.published_at || blog.created_at,
            ).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            const categoryName =
              (blog.category || "casc").toLowerCase() === "casc"
                ? "CASC"
                : (blog.category || "").toLowerCase() === "medico-legal"
                  ? isRtl
                    ? "الطب القضائي"
                    : "Medico-Legal"
                  : blog.category;

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
                        alt={excerpt || title || "Article cover"}
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
                      {categoryName && (
                        <span className="border border-[#d6b03f]/50 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#d6b03f] bg-[#d6b03f]/10">
                          {categoryName}
                        </span>
                      )}
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
                      {Number(blog.views_count) > 0 && (
                        <>
                          <span className="text-white/20">•</span>
                          <span
                            className="inline-flex items-center gap-1 text-gold/90 text-[11px] font-mono"
                            title={isRtl ? "المشاهدات" : "Views"}
                          >
                            <Eye className="size-3 text-gold/80" />
                            <span>{blog.views_count}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-white group-hover:text-gold transition-colors duration-200 leading-snug line-clamp-2">
                      {title}
                    </h2>

                    {excerpt && (
                      <p className="text-lbody text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans">
                        {excerpt}
                      </p>
                    )}

                    <div className="pt-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:text-white transition-colors">
                        <span>{readMore}</span>
                        <ArrowRight
                          className={`size-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${
                            isRtl ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
