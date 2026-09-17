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
  return createLocalizedMetadata(locale as Locale, "refundPolicy");
}

export default async function RefundPolicyLayout({
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
    "/refund-policy",
    isAr ? "سياسة الاسترداد" : "Refund Policy",
    isAr
      ? "سياسة الاسترداد والإلغاء لبرامج ودورات ميدليكس."
      : "Cancellation and refund terms for MedLex courses and coaching sessions.",
  );

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
