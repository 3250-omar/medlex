import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createCollectionPageSchema } from "@/lib/seo/schema";
import {
  createLocalizedMetadata,
  CANONICAL_ORIGIN,
  type Locale,
} from "@/lib/seo/metadata";
import { getPublishedBlogs } from "./_actions/blog-actions";
import { BlogsCatalog } from "./_comps/BlogsCatalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === "ar";
  const baseMetadata = await createLocalizedMetadata(locale as Locale, "blogs");

  const title = isRtl
    ? "المقالات والتحليلات | MedLex"
    : "Articles & Insights | MedLex";
  const description = isRtl
    ? "مقالات في امتحان CASC والممارسة الطبية القانونية والقيادة السريرية بقلم استشاري الطب النفسي الشرعي د. أحمد أبو الغيط."
    : "Articles on the MRCPsych CASC, medico-legal practice and clinical leadership by Consultant Forensic Psychiatrist Dr Ahmed Abouelghit.";

  return {
    ...baseMetadata,
    title: { absolute: title },
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
  };
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
    ? "أحدث الرؤى والأوراق التحليلية في الطب النفسي الشرعي والأنظمة الصحية بقلم د. أحمد أبو الغيط."
    : "Original editorial analyses, medicolegal frameworks, and institutional insights by Dr Ahmed Abouelghit.";
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
        <BlogsCatalog initialBlogs={blogs} isRtl={isRtl} locale={locale} />
      </section>
    </main>
  );
}
