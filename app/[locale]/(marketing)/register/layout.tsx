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
  return createLocalizedMetadata(locale as Locale, "register");
}

export default async function RegisterLayout({
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
    "/register",
    isAr
      ? "تسجيل الاهتمام ببرامج ميدليكس"
      : "Register Your Interest in MedLex Programmes",
    isAr
      ? "سجّل اهتمامك بالدفعات التدريبية القادمة في الطب النفسي الشرعي وامتحانات CASC."
      : "Submit your interest in upcoming MedLex forensic psychiatry cohorts and CASC mock examinations.",
  );

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
