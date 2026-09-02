import { getTranslations } from "next-intl/server";
import EditorialPage from "@/components/marketing/EditorialPage";

type EditorialSection = {
  eyebrow: string;
  title: string;
  body: string;
};

type LocalizedEditorialPageProps = {
  locale: string;
  page: "contact" | "register" | "privacy" | "terms" | "refunds";
  ctaHref?: string;
};

export default async function LocalizedEditorialPage({
  locale,
  page,
  ctaHref,
}: LocalizedEditorialPageProps) {
  const t = await getTranslations({
    locale,
    namespace: `editorialPages.${page}`,
  });

  return (
    <EditorialPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      sections={t.raw("sections") as EditorialSection[]}
      cta={ctaHref ? { label: t("cta"), href: ctaHref } : undefined}
    />
  );
}
