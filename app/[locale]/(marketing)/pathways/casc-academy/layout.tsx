import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createPageMetadata, siteUrl } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: "en" | "ar" }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ locale, path: "/pathways/casc-academy", title: "CASC Academy | Psychiatry Examination Preparation", description: "Prepare for the CASC with a structured MedLex learning pathway built around clinical reasoning, communication, and defensible decisions." });
}

export default function CascAcademyLayout({ children }: { children: ReactNode }) {
  return <><JsonLd data={{ "@context": "https://schema.org", "@type": "Course", name: "CASC Academy", description: "Structured CASC preparation for psychiatry professionals.", provider: { "@type": "Organization", name: "MedLex", url: siteUrl.toString() } }} />{children}</>;
}
