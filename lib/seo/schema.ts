import { CANONICAL_ORIGIN } from "./metadata";

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MedLex",
    alternateName: "MedLex Solutions",
    url: CANONICAL_ORIGIN,
    logo: `${CANONICAL_ORIGIN}/images/medlex-mark.svg`,
    description:
      "Forensic and medicolegal psychiatry education and institutional services.",
    founder: {
      "@type": "Person",
      name: "Dr Ahmed Abouelghit",
      jobTitle: "Consultant Forensic Psychiatrist",
      url: `${CANONICAL_ORIGIN}/en/founder`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "info@medlexsolutions.com",
      telephone: "+201019515321",
      availableLanguage: ["English", "Arabic"],
    },
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MedLex",
    url: CANONICAL_ORIGIN,
    inLanguage: ["en", "ar"],
    description:
      "Specialist professional education in forensic psychiatry, medicolegal reporting, and MRCPsych CASC coaching.",
    publisher: {
      "@type": "Organization",
      name: "MedLex",
      url: CANONICAL_ORIGIN,
    },
  };
}

export function createPersonSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: isAr ? "د. أحمد أبو الغيط" : "Dr Ahmed Abouelghit",
      jobTitle: isAr
        ? "استشاري الطب النفسي الشرعي والقضائي"
        : "Consultant Forensic Psychiatrist",
      worksFor: {
        "@type": "Organization",
        name: "MedLex",
        url: CANONICAL_ORIGIN,
      },
      description: isAr
        ? "استشاري الطب النفسي الشرعي ومؤسس ميدليكس، ممارس معتمد في المملكة المتحدة ومصر وقطر."
        : "Consultant Forensic Psychiatrist and founder of MedLex, practicing across the United Kingdom, Egypt, and Qatar.",
      url: `${CANONICAL_ORIGIN}/${locale}/founder`,
      knowsAbout: [
        "Forensic Psychiatry",
        "Medicolegal Reporting",
        "MRCPsych CASC Coaching",
        "Expert Witness Testimony",
      ],
    },
  };
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createCourseSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: isAr
      ? "أكاديمية CASC للتحضير لامتحان MRCPsych"
      : "MRCPsych CASC Preparation & Coaching",
    description: isAr
      ? "برنامج تدريبي سريري ومحاكاة دقيقة لمحطات امتحان الزمالة الملكية للطب النفسي CASC بإشراف استشاري."
      : "Consultant-led clinical preparation, video station walkthroughs, and structured performance coaching for the MRCPsych CASC examination.",
    provider: {
      "@type": "Organization",
      name: "MedLex",
      url: CANONICAL_ORIGIN,
    },
    instructor: {
      "@type": "Person",
      name: isAr ? "د. أحمد أبو الغيط" : "Dr Ahmed Abouelghit",
      jobTitle: isAr
        ? "استشاري الطب النفسي الشرعي والقضائي"
        : "Consultant Forensic Psychiatrist",
      url: `${CANONICAL_ORIGIN}/${locale}/founder`,
    },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: isAr
        ? "أطباء الطب النفسي والمرشحون لامتحان CASC"
        : "Psychiatry Trainees & MRCPsych CASC Candidates",
    },
    educationalLevel: "Postgraduate Medical Education / MRCPsych",
    courseMode: "online",
    educationalCredentialAwarded: "MedLex Certificate of Completion",
    inLanguage: isAr ? "ar" : "en",
    isAccessibleForFree: false,
    url: `${CANONICAL_ORIGIN}/${locale}/pathways/casc-academy`,
  };
}

export function createServiceSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isAr
      ? "خدمات الطب النفسي الشرعي للمحاكم والمؤسسات"
      : "Forensic Psychiatry Services for Courts & Institutions",
    description: isAr
      ? "تقارير نفسية شرعية متخصصة واستشارات خبيرة للمحاكم وجهات الادعاء والمؤسسات الصحية والقضائية."
      : "Defensible forensic psychiatric evaluations, independent case reviews, and specialist institutional consultancy for courts, prosecution, and legal bodies.",
    provider: {
      "@type": "Organization",
      name: "MedLex",
      url: CANONICAL_ORIGIN,
    },
    serviceType: "Medicolegal Psychiatric Evaluation",
    areaServed: ["GB", "EG", "QA"],
    url: `${CANONICAL_ORIGIN}/${locale}/institutional`,
  };
}

export function createContactPageSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: isAr ? "اتصل بميدليكس" : "Contact MedLex",
    url: `${CANONICAL_ORIGIN}/${locale}/contact`,
    description: isAr
      ? "تواصل مع ميدليكس للاستفسار عن برامج التعليم والخدمات المؤسسية."
      : "Enquire about MedLex courses, professional pathways, or institutional services.",
    mainEntity: {
      "@type": "Organization",
      name: "MedLex",
      email: "info@medlexsolutions.com",
      telephone: "+201019515321",
    },
  };
}

export function createFaqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createLearningResourceSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: isAr
      ? "معاينة مجانية لمحطة CASC: المحطة 7.2"
      : "Free MRCPsych CASC Station Preview: Station 7.2",
    description: isAr
      ? "محطة تدريبية تفاعلية مجانية من أكاديمية CASC لتقييم المهارات السريرية في الطب النفسي."
      : "Interactive full-length preview station from the MedLex CASC Academy showcasing consultant clinical reasoning, mark sheet, and exam simulations.",
    learningResourceType: "Exam Simulation",
    educationalLevel: "Postgraduate Medical Education",
    url: `${CANONICAL_ORIGIN}/${locale}/academy/preview/station-7-2`,
    provider: {
      "@type": "Organization",
      name: "MedLex",
      url: CANONICAL_ORIGIN,
    },
  };
}

export function createCollectionPageSchema(
  locale: string,
  path: string,
  name: string,
  description: string,
  items: Array<{ name: string; url: string; description: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${CANONICAL_ORIGIN}/${locale}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: item.url,
      })),
    },
  };
}

export function createWebPageSchema(
  locale: string,
  path: string,
  name: string,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${CANONICAL_ORIGIN}/${locale}${path}`,
    publisher: {
      "@type": "Organization",
      name: "MedLex",
      url: CANONICAL_ORIGIN,
    },
  };
}

export function createBlogBreadcrumbSchema(
  locale: string,
  slug: string,
  title: string,
) {
  const isAr = locale === "ar";
  return createBreadcrumbSchema([
    {
      name: isAr ? "الرئيسية" : "Home",
      url: `${CANONICAL_ORIGIN}/${locale}`,
    },
    {
      name: isAr ? "المقالات والتحليلات" : "Articles & Insights",
      url: `${CANONICAL_ORIGIN}/${locale}/blogs`,
    },
    {
      name: title,
      url: `${CANONICAL_ORIGIN}/${locale}/blogs/${slug}`,
    },
  ]);
}

export function createBlogArticleSchema({
  locale,
  slug,
  title,
  excerpt,
  content,
  coverImage,
  ogImageUrl,
  publishedAt,
  updatedAt,
  createdAt,
  tags,
  authorName,
  likesCount,
  sharesCount,
  viewsCount,
}: {
  locale: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  ogImageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  tags?: string[] | null;
  authorName: string;
  likesCount?: number;
  sharesCount?: number;
  viewsCount?: number;
}) {
  const isAr = locale === "ar";
  const canonicalUrl = `${CANONICAL_ORIGIN}/${locale}/blogs/${slug}`;
  const resolvedPublished =
    publishedAt || createdAt || new Date("2026-01-01").toISOString();
  const resolvedModified =
    updatedAt || publishedAt || createdAt || resolvedPublished;

  // Calculate word count & reading time
  const wordCount = content
    ? content
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  // Determine images
  const images: string[] = [];
  if (ogImageUrl) images.push(ogImageUrl);
  if (coverImage) images.push(coverImage);
  images.push(
    `${CANONICAL_ORIGIN}/api/og?title=${encodeURIComponent(title)}&locale=${locale}&type=article&author=${encodeURIComponent(authorName)}`,
  );

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    isPartOf: {
      "@type": "Blog",
      "@id": `${CANONICAL_ORIGIN}/${locale}/blogs`,
      name: isAr ? "مدونة ميدليكس" : "MedLex Editorial",
      publisher: {
        "@type": "Organization",
        name: "MedLex",
        url: CANONICAL_ORIGIN,
      },
    },
    headline: title,
    description: excerpt || title,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    inLanguage: isAr ? "ar" : "en",
    datePublished: resolvedPublished,
    dateModified: resolvedModified,
    wordCount: wordCount > 0 ? wordCount : undefined,
    timeRequired: `PT${readingTimeMinutes}M`,
    image: images,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: isAr
        ? "استشاري الطب النفسي الشرعي والقضائي"
        : "Consultant Forensic Psychiatrist",
      url: `${CANONICAL_ORIGIN}/${locale}/founder`,
      sameAs: [
        "https://www.linkedin.com/in/ahmed-abouelghit",
        `${CANONICAL_ORIGIN}/${locale}/founder`,
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "MedLex",
      url: CANONICAL_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${CANONICAL_ORIGIN}/images/medlex-mark.svg`,
        width: 180,
        height: 60,
      },
    },
  };

  if (tags && tags.length > 0) {
    schema.keywords = tags.join(", ");
    schema.articleSection = tags[0];
  } else {
    schema.articleSection = isAr
      ? "الطب النفسي الشرعي والقانون الطبي"
      : "Forensic Psychiatry & Medicolegal Practice";
  }

  const interactions: Array<Record<string, unknown>> = [];
  if (typeof likesCount === "number" && likesCount > 0) {
    interactions.push({
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: likesCount,
    });
  }
  if (typeof sharesCount === "number" && sharesCount > 0) {
    interactions.push({
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ShareAction",
      userInteractionCount: sharesCount,
    });
  }
  if (typeof viewsCount === "number" && viewsCount > 0) {
    interactions.push({
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ViewAction",
      userInteractionCount: viewsCount,
    });
  }

  if (interactions.length > 0) {
    schema.interactionStatistic = interactions;
  }

  return schema;
}
