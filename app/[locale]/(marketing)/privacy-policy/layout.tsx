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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Promise<any>;
}) {
  const resolvedParams = params ? await params : { locale: "en" };
  const locale = resolvedParams.locale ?? "en";
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
