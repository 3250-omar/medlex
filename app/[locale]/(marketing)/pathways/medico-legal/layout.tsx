import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/pathways/medico-legal", title: "Medicolegal Psychiatry Education", description: "Build the clinical reasoning, report-writing, and communication skills needed for defensible medicolegal psychiatric evidence." });
}

export default function MedicoLegalLayout({ children }: { children: ReactNode }) { return children; }
