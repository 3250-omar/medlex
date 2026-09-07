import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/institutional", title: "Institutional Services", description: "MedLex delivers clear, defensible psychiatric evidence and specialist education for courts, prosecutors, and public institutions." });
}

export default function InstitutionalLayout({ children }: { children: ReactNode }) { return children; }
