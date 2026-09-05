import InstitutionalPageClient from "./_comp/InstitutionalPageClient";

interface InstitutionalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InstitutionalPage({
  params,
}: InstitutionalPageProps) {
  const { locale } = await params;

  return <InstitutionalPageClient locale={locale} />;
}
