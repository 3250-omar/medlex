import PublicStationPreview from "../../_comps/PublicStationPreview";

export default async function StationPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PublicStationPreview locale={locale} />;
}
