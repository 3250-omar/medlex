import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createPersonSchema } from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "founder");
}

export default async function FounderLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={createPersonSchema(locale)} />
      {children}
    </>
  );
}
