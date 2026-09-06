"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
} from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export type AuthTab = "sign-in" | "register";
export type Pathway = "medico-legal" | "casc-academy" | "foundations";

export type ContextValue = {
  openInterestDialog: (
    pathway?: Pathway,
    tab?: AuthTab,
    onAuthenticated?: () => Promise<void> | void,
  ) => void;
};

export const InterestDialogContext = createContext<ContextValue | null>(null);

export function InterestDialogProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const openInterestDialog = useCallback(
    (
      nextPathway: Pathway = "medico-legal",
      nextTab: AuthTab = "register",
      _onAuthenticated?: () => Promise<void> | void,
    ) => {
      void _onAuthenticated;
      const params = new URLSearchParams();
      params.set("tab", nextTab);
      if (nextPathway) {
        params.set("pathway", nextPathway);
      }
      if (pathname && !pathname.includes("/auth")) {
        params.set("redirect", pathname);
      }
      router.push(`/${locale}/auth?${params.toString()}`);
    },
    [locale, pathname, router],
  );

  return (
    <InterestDialogContext.Provider value={{ openInterestDialog }}>
      {children}
    </InterestDialogContext.Provider>
  );
}

export function InterestDialogTrigger({
  children,
  className,
  pathway = "medico-legal",
  tab = "register",
}: {
  children: ReactNode;
  className: string;
  pathway?: Pathway;
  tab?: AuthTab;
}) {
  const context = useContext(InterestDialogContext);
  if (!context) {
    throw new Error(
      "InterestDialogTrigger must be used inside InterestDialogProvider.",
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => context.openInterestDialog(pathway, tab)}
    >
      {children}
    </button>
  );
}
