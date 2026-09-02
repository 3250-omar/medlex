import LocalizedEditorialPage from "@/components/marketing/LocalizedEditorialPage";

type PageProps = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedEditorialPage locale={locale} page="terms" />;
}