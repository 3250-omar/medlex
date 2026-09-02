import LocalizedEditorialPage from "@/components/marketing/LocalizedEditorialPage";

type PageProps = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedEditorialPage locale={locale} page="privacy" />;
}