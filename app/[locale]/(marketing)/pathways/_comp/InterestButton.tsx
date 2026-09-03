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
  const className = "inline-flex min-h-12 items-center justify-center bg-signal px-6 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal disabled:cursor-not-allowed disabled:opacity-60";

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
