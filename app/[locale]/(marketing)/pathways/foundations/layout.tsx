import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/pathways/foundations", title: "Foundations of Medicolegal Psychiatry", description: "Develop a rigorous foundation in the language, ethics, and clinical reasoning of medicolegal psychiatry." });
}

export default function FoundationsLayout({ children }: { children: ReactNode }) { return children; }
