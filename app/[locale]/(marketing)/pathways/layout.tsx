import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createLocalizedMetadata, type Locale } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocalizedMetadata(locale as Locale, "pathways");
}

export default function PathwaysLayout({ children }: { children: ReactNode }) {
  return children;
}
