import type { ReactNode } from "react";
import { JsonLd } from "@/lib/seo/JsonLd";
import { createOrganizationSchema } from "@/lib/seo/schema";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={createOrganizationSchema()} />
      {children}
    </>
  );
}
