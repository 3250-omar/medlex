import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createWebPageSchema } from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "terms");
}

export default async function TermsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const schema = createWebPageSchema(
    locale,
    "/terms",
    isAr ? "الشروط والأحكام" : "Terms and Conditions",
    isAr
      ? "الشروط والأحكام المنظمة لاستخدام منصة وبرامج ميدليكس."
      : "Terms and conditions governing enrolment and platform usage in MedLex.",
  );

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
