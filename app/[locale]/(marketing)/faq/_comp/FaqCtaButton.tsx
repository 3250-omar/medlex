"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { useCurrentUser } from "../../_apiCalls/academyQueries";

export default function FaqCtaButton() {
  const locale = useLocale();
  const t = useTranslations("faq");
  const { data: user } = useCurrentUser();

  const className =
    "btn btn-navy !py-3.5 !px-8 text-sm font-semibold gap-2.5 inline-flex items-center shadow-lg shadow-navy/15 hover:shadow-xl hover:-translate-y-0.5 transition-all";

  if (user) {
    return (
      <Link href={`/${locale}/courses`} className={className}>
        {t("ctaLoggedIn")}{" "}
        <span aria-hidden="true" className="rtl:rotate-180">
          →
        </span>
      </Link>
    );
  }

  return (
    <InterestDialogTrigger className={className}>
      {t("cta")}{" "}
      <span aria-hidden="true" className="rtl:rotate-180">
        →
      </span>
    </InterestDialogTrigger>
  );
}
