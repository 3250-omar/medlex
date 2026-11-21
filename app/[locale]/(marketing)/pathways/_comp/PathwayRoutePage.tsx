import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import PathwayDetailPage from "./PathwayDetailPage";
import {
  type PathwayContent,
  type PathwayKey,
  type PathwayLabels,
} from "./pathwayContent";

import { createPublicClient } from "@/lib/supabase/public";

type PathwayRoutePageProps = {
  locale: string;
  pathway: PathwayKey;
};

async function fetchPathwayCoursePrice(
  pathway: PathwayKey,
  countryCode: string,
) {
  return unstable_cache(
    async () => {
      const supabase = createPublicClient();

      const { data: course } = await supabase
        .from("courses")
        .select("id, price, currency")
        .eq("slug", pathway)
        .single();

      if (!course) return null;

      const countryCodes =
        countryCode === "__OTHER__"
          ? ["__OTHER__"]
          : [countryCode, "__OTHER__"];

      const { data: countryPrices } = await supabase
        .from("course_country_prices")
        .select("country_code, price, currency")
        .eq("course_id", course.id)
        .in("country_code", countryCodes)
        .eq("is_active", true);

      const exactMatch = countryPrices?.find(
        (row) => row.country_code === countryCode,
      );
      const fallbackMatch = countryPrices?.find(
        (row) => row.country_code === "__OTHER__",
      );
      const resolvedPrice = exactMatch ?? fallbackMatch;

      if (resolvedPrice) {
        return {
          ...course,
          price: resolvedPrice.price,
          currency: resolvedPrice.currency,
        };
      }

      return course;
    },
    ["pathway-course-price", pathway, countryCode],
    { revalidate: 300 },
  )();
}

export default async function PathwayRoutePage({
  locale,
  pathway,
}: PathwayRoutePageProps) {
  const t = await getTranslations({ locale, namespace: "pathwayPages" });

  const headersList = await headers();
  const countryCode = (
    headersList.get("x-user-country") ||
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    "EG"
  ).toUpperCase();

  const course = await fetchPathwayCoursePrice(pathway, countryCode);

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
