import PathwayRoutePage from "../_comp/PathwayRoutePage";

export default async function MedicoLegalPathwayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PathwayRoutePage locale={locale} pathway="medico-legal" />;
}
