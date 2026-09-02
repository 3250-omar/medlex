import { getTranslations } from "next-intl/server";
import PathwayDetailPage from "./PathwayDetailPage";
import {
  type PathwayContent,
  type PathwayKey,
  type PathwayLabels,
} from "./pathwayContent";

type PathwayRoutePageProps = {
  locale: string;
  pathway: PathwayKey;
};

export default async function PathwayRoutePage({
  locale,
  pathway,
}: PathwayRoutePageProps) {
  const t = await getTranslations({ locale, namespace: "pathwayPages" });

  return (
    <PathwayDetailPage
      pathway={pathway}
      content={t.raw(pathway) as PathwayContent}
      labels={t.raw("labels") as PathwayLabels}
    />
  );
}
