import { InterestDialogTrigger } from "@/components/marketing/InterestDialog";
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
  return (
    <InterestDialogTrigger
      pathway={pathwayLabels[pathway]}
      className="inline-flex min-h-12 items-center justify-center bg-signal px-6 font-body text-sm font-medium text-ink transition-colors hover:bg-signal-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
    >
      {children}{" "}
      <span className="ms-3" aria-hidden="true">
        →
      </span>
    </InterestDialogTrigger>
  );
}
