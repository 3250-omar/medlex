"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
import { useCurrentUser } from "../../_apiCalls/academyQueries";
import { type PathwayKey } from "./pathwayContent";

const pathwayLabels: Record<
  PathwayKey,
  "medico-legal" | "casc-academy" | "foundations"
> = {
  "medico-legal": "medico-legal",
  "casc-academy": "casc-academy",
  foundations: "foundations",
};

interface InterestButtonProps {
  pathway: PathwayKey;
  children: React.ReactNode;
}

export default function InterestButton({
  pathway,
  children,
}: InterestButtonProps) {
  const locale = useLocale();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const className =
    "btn btn-gold !rounded-full !min-h-12 !px-7 font-body text-sm font-semibold text-navy inline-flex items-center justify-center transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

  if (user) {
    return <button type="button" className={className} onClick={() => router.push(`/${locale}/courses`)}>Go to your courses <span className="ms-3" aria-hidden="true">â†’</span></button>;
  }
  return (
    <InterestDialogTrigger
      pathway={pathwayLabels[pathway]}
      className={className}
    >
      {children}{" "}
      <span className="ms-3" aria-hidden="true">
        →
      </span>
    </InterestDialogTrigger>
  );
}
