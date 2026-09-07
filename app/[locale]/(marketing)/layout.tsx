import type { ReactNode } from "react";
import { JsonLd } from "@/lib/seo/JsonLd";
import { siteUrl } from "@/lib/seo/metadata";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MedLex",
          url: siteUrl.toString(),
          description:
            "Forensic and medicolegal psychiatry education and institutional services.",
          logo: new URL("/images/medlex-mark.svg", siteUrl).toString(),
        }}
      />
      {children}
    </>
  );
}
