import PathwayRoutePage from "../_comp/PathwayRoutePage";

export default async function CascAcademyPathwayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PathwayRoutePage locale={locale} pathway="casc-academy" />;
}
