import { getTranslations } from "next-intl/server";
import PathwayDetailPage from "./PathwayDetailPage";
import {
  type PathwayContent,
  type PathwayKey,
  type PathwayLabels,
} from "./pathwayContent";

import { createClient } from "@/lib/supabase/server";

type PathwayRoutePageProps = {
  locale: string;
  pathway: PathwayKey;
};

export default async function PathwayRoutePage({
  locale,
  pathway,
}: PathwayRoutePageProps) {
  const t = await getTranslations({ locale, namespace: "pathwayPages" });

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("price, currency")
    .eq("slug", pathway)
    .single();

  return (
    <PathwayDetailPage
      locale={locale}
      pathway={pathway}
      content={t.raw(pathway) as PathwayContent}
      labels={t.raw("labels") as PathwayLabels}
      courseData={course || null}
    />
  );
}
