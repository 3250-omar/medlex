import * as React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthPageContent from "@/components/auth/AuthPageContent";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: `${t("title")} | MedLex`,
    description: t("description"),
  };
}

export default async function AuthPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
        </div>
      }
    >
      <AuthPageContent />
    </React.Suspense>
  );
}
