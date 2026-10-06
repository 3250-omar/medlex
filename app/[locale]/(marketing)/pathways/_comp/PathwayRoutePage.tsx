import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
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
  const headersList = await headers();
  const countryCode = (
    headersList.get("x-user-country") ||
    headersList.get("x-vercel-ip-country") ||
    headersList.get("cf-ipcountry") ||
    "EG"
  ).toUpperCase();

  const { data: course } = await supabase
    .from("courses")
    .select("id, price, currency")
    .eq("slug", pathway)
    .single();

  if (course) {
    const { data: countryPrice } = await supabase
      .from("course_country_prices")
      .select("price, currency")
      .eq("course_id", course.id)
      .eq("country_code", countryCode)
      .eq("is_active", true)
      .maybeSingle();

    if (countryPrice) {
      course.price = countryPrice.price;
      course.currency = countryPrice.currency;
    } else {
      const { data: otherPrice } = await supabase
        .from("course_country_prices")
        .select("price, currency")
        .eq("course_id", course.id)
        .eq("country_code", "__OTHER__")
        .eq("is_active", true)
        .maybeSingle();

      if (otherPrice) {
        course.price = otherPrice.price;
        course.currency = otherPrice.currency;
      }
    }
  }

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
