import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createServiceSchema } from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "institutional");
}

export default async function InstitutionalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={createServiceSchema(locale)} />
      {children}
    </>
  );
}
