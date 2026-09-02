"use client";

import { Check, X } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Pathway = "medico-legal" | "casc-academy" | "foundations";
type ContextValue = { openInterestDialog: (pathway?: Pathway) => void };
const InterestContext = createContext<ContextValue | null>(null);
const pathwayKeys: Record<Pathway, "medicoLegal" | "academy" | "foundations"> =
  {
    "medico-legal": "medicoLegal",
    "casc-academy": "academy",
    foundations: "foundations",
  };

export function InterestDialogProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("registration");
  const [open, setOpen] = useState(false);
  const [pathway, setPathway] = useState<Pathway>("medico-legal");
  const [complete, setComplete] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
    setComplete(false);
  }, []);
  const openInterestDialog = useCallback(
    (nextPathway: Pathway = "medico-legal") => {
      setPathway(nextPathway);
      setComplete(false);
      setOpen(true);
    },
    [],
  );
  return (
    <InterestContext.Provider value={{ openInterestDialog }}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}
      >
        <DialogContent
          showCloseButton={false}
          aria-labelledby="interest-title"
          className="max-h-[calc(100dvh-2rem)] max-w-[54rem] overflow-y-auto rounded-none border-line bg-surface p-0 text-text shadow-2xl sm:max-w-[54rem]"
        >
          <div className="relative p-6 sm:p-10">
            <DialogClose
              className="absolute right-4 top-4 grid size-11 place-items-center border border-line text-muted transition-colors hover:border-signal hover:text-ink"
              aria-label={t("done")}
            >
              <X className="size-5" aria-hidden="true" />
            </DialogClose>
            {complete ? (
              <div
                className="mx-auto max-w-xl py-8 text-center"
                aria-live="polite"
              >
                <span className="mx-auto grid size-14 place-items-center rounded-full border border-signal text-signal">
                  <Check className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-8 font-body text-[10px] uppercase tracking-[.24em] text-signal">
                  {t("confirmedLabel")}
                </p>
                <DialogTitle className="mt-4 font-display text-3xl font-normal text-ink">
                  {t("confirmedTitle")}
                </DialogTitle>
                <DialogDescription className="mt-4 text-sm leading-7 text-muted">
                  {t("confirmedDescription", {
                    pathway: t(pathwayKeys[pathway]),
                  })}
                </DialogDescription>
                <DialogClose className="mt-8 min-h-12 bg-ink px-7 font-body text-sm text-surface transition-colors hover:bg-accent">
                  {t("done")}
                </DialogClose>
              </div>
            ) : (
              <>
                <DialogTitle className="pr-12 font-display text-3xl font-normal text-ink sm:text-[2rem]">
                  {t("title")}
                </DialogTitle>
                <DialogDescription className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                  {t("description")}
                </DialogDescription>
                <div
                  className="mt-7 flex flex-wrap gap-x-8 border-b border-line pb-4 sm:gap-x-9"
                  role="tablist"
                  aria-label={t("choosePathway")}
                >
                  {(Object.keys(pathwayKeys) as Pathway[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={pathway === key}
                      onClick={() => setPathway(key)}
                      className="min-h-11 text-xs text-muted transition-colors hover:text-ink"
                    >
                      {t(pathwayKeys[key])}
                    </button>
                  ))}
                </div>
                <form
                  className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(15rem,1fr)] lg:gap-7"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setComplete(true);
                  }}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label={t("fullName")}
                      name="full-name"
                      autoComplete="name"
                    />
                    <Field
                      label={t("username")}
                      name="username"
                      autoComplete="username"
                    />
                    <Field
                      label={t("email")}
                      name="email"
                      type="email"
                      autoComplete="email"
                    />
                    <Field
                      label={t("phone")}
                      name="phone-number"
                      type="tel"
                      autoComplete="tel"
                    />
                    <Field
                      label={t("password")}
                      name="password"
                      type="password"
                      autoComplete="new-password"
                    />
                  </div>
                  <aside className="border border-line border-t-signal p-6 lg:self-start">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-[.2em] text-muted">
                      {t("free")}
                    </p>
                    <h3 className="mt-5 font-display text-xl font-normal text-ink">
                      {t("guide")}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted">
                      {t("guideDescription")}
                    </p>
                    <span className="mt-4 inline-block border border-dashed border-signal px-2 py-1 font-body text-[10px] text-signal">
                      {t("file")}
                    </span>
                  </aside>
                  <div className="lg:col-start-1">
                    <span className="inline-block border border-dashed border-signal px-2 py-1 font-body text-[10px] text-signal">
                      {t("account")}
                    </span>
                    <button
                      type="submit"
                      className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 bg-signal px-7 font-body text-sm text-ink transition-colors hover:bg-signal-light"
                    >
                      {t("submit")} <span aria-hidden="true">→</span>
                    </button>
                    <p className="mt-5 max-w-md text-xs leading-6 text-muted">
                      {t("privacy")}
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </InterestContext.Provider>
  );
}
function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label
      className="grid gap-2 text-[10px] uppercase tracking-[.12em] text-muted"
      htmlFor={name}
    >
      <span>{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="min-h-11 border-b border-line bg-transparent px-0 text-sm normal-case tracking-normal text-text outline-none transition-colors focus:border-signal"
      />
    </label>
  );
}
export function InterestDialogTrigger({
  children,
  className,
  pathway,
}: {
  children: ReactNode;
  className: string;
  pathway?: Pathway;
}) {
  const context = useContext(InterestContext);
  if (!context)
    throw new Error(
      "InterestDialogTrigger must be used inside InterestDialogProvider.",
    );
  return (
    <button
      type="button"
      className={className}
      onClick={() => context.openInterestDialog(pathway)}
    >
      {children}
    </button>
  );
}
