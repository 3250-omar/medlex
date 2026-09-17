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
  return createLocalizedMetadata(locale as Locale, "privacy");
}

export default async function PrivacyLayout({
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
    "/privacy",
    isAr ? "سياسة الخصوصية" : "Privacy Policy",
    isAr
      ? "سياسة الخصوصية وحماية البيانات الشخصية في ميدليكس."
      : "Privacy and data protection policy for MedLex educational services.",
  );

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
