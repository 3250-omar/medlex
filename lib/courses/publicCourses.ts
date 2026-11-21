import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Course } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";

export async function getPublishedCoursesForCountry(
  countryCode: string,
): Promise<Course[]> {
  const normalizedCountry = (countryCode || "EG").toUpperCase();

  return unstable_cache(
    async (): Promise<Course[]> => {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("courses")
        .select(
          "id, slug, title_en, title_ar, description_en, description_ar, features_en, features_ar, course_status, currency, price, access_duration_days, points_on_completion, is_published, created_at",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }

      const courseIds = data.map((course) => course.id);
      const countryPriceMap = new Map<
        string,
        { price: number; currency: string }
      >();

      if (courseIds.length > 0) {
        const countryCodes =
          normalizedCountry === "__OTHER__"
            ? ["__OTHER__"]
            : [normalizedCountry, "__OTHER__"];

        const { data: countryPrices } = await supabase
          .from("course_country_prices")
          .select("course_id, country_code, price, currency")
          .in("course_id", courseIds)
          .in("country_code", countryCodes)
          .eq("is_active", true);

        if (countryPrices) {
          for (const row of countryPrices) {
            if (row.country_code === normalizedCountry) {
              countryPriceMap.set(row.course_id, {
                price: row.price,
                currency: row.currency,
              });
            } else if (
              row.country_code === "__OTHER__" &&
              !countryPriceMap.has(row.course_id)
            ) {
              countryPriceMap.set(row.course_id, {
                price: row.price,
                currency: row.currency,
              });
            }
          }
        }
      }

      return data.map((course) => {
        const countryPrice = countryPriceMap.get(course.id);
        return {
          ...course,
          course_status: course.course_status as Course["course_status"],
          price: countryPrice?.price ?? course.price,
          currency: countryPrice?.currency ?? course.currency,
        };
      });
    },
    ["published-courses", normalizedCountry],
    { revalidate: 300 },
  )();
}
