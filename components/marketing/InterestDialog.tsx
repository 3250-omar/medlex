"use client";

import { X } from "lucide-react";
import {
  createContext,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useSignInMutation,
  useSignUpMutation,
} from "@/components/marketing/authMutations";
import { signInSchema, signUpSchema } from "@/lib/auth/validation";

type AuthTab = "sign-in" | "register";
type Pathway = "medico-legal" | "casc-academy" | "foundations";
type AuthField = "fullName" | "username" | "email" | "phone" | "password";
type ContextValue = {
  openInterestDialog: (pathway?: Pathway, tab?: AuthTab) => void;
};

const InterestContext = createContext<ContextValue | null>(null);
const pathwayKeys: Record<Pathway, "medicoLegal" | "academy" | "foundations"> =
  {
    "medico-legal": "medicoLegal",
    "casc-academy": "academy",
    foundations: "foundations",
  };

export function InterestDialogProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("registration");
  const auth = useTranslations("auth");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("register");
  const [pathway, setPathway] = useState<Pathway>("medico-legal");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<AuthField, string>>
  >({});
  const signIn = useSignInMutation();
  const signUp = useSignUpMutation();

  const close = useCallback(() => {
    setOpen(false);
    setFormError(null);
    signIn.reset();
    signUp.reset();
  }, [signIn, signUp]);

  const openInterestDialog = useCallback(
    (nextPathway: Pathway = "medico-legal", nextTab: AuthTab = "register") => {
      setPathway(nextPathway);
      setTab(nextTab);
      setFormError(null);
      setOpen(true);
    },
    [],
  );

  const shouldForceSignIn = searchParams.get("auth") === "sign-in";

  const validationMessages: Record<AuthField, string> = {
    fullName: auth("validation.fullName"),
    username: auth("validation.username"),
    email: auth("validation.email"),
    phone: auth("validation.phone"),
    password: auth("validation.password"),
  };

  function getFieldErrors(issues: { path: PropertyKey[] }[]) {
    return issues.reduce<Partial<Record<AuthField, string>>>((errors, issue) => {
      const field = String(issue.path[0]) as AuthField;
      if (field in validationMessages) errors[field] = validationMessages[field];
      return errors;
    }, {});
  }

  function validateField(field: AuthField, value: string) {
    const result = signUpSchema.shape[field].safeParse(value);
    setFieldErrors((current) => ({
      ...current,
      [field]: result.success ? undefined : validationMessages[field],
    }));
  }

  function clearFieldError(field: AuthField) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      return { ...current, [field]: undefined };
    });
  }

  function handleSuccess() {
    close();
    router.push(`/${locale}/courses`);
  }

  function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const formData = new FormData(event.currentTarget);
    const input = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const validation = signInSchema.safeParse(input);
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error.issues));
      return;
    }

    signIn.mutate(validation.data, {
      onSuccess: handleSuccess,
      onError: (error) => setFormError(error.message),
    });
  }

  function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const formData = new FormData(event.currentTarget);
    const input = {
      fullName: String(formData.get("full-name") ?? ""),
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone-number") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const validation = signUpSchema.safeParse(input);
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error.issues));
      return;
    }

    signUp.mutate(validation.data, {
      onSuccess: handleSuccess,
      onError: (error) => setFormError(error.message),
    });
  }

  const isSubmitting = signIn.isPending || signUp.isPending;

  return (
    <InterestContext.Provider value={{ openInterestDialog }}>
      {children}
      <Dialog
        open={open || shouldForceSignIn}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setOpen(true);
            return;
          }

          close();
          if (shouldForceSignIn) router.replace(pathname);
        }}
      >
        <DialogContent
          showCloseButton={false}
          aria-labelledby="auth-title"
          className="max-h-[calc(100dvh-2rem)] max-w-[40rem] overflow-y-auto rounded-none border-line bg-surface p-0 text-text shadow-2xl sm:max-w-[40rem]"
        >
          <div className="relative p-6 sm:p-10">
            <DialogClose
              className="absolute end-4 top-4 grid size-11 place-items-center border border-line text-muted transition-colors hover:border-signal hover:text-signal"
              aria-label={t("done")}
            >
              <X className="size-5" aria-hidden="true" />
            </DialogClose>
            <DialogTitle
              id="auth-title"
              className="pe-12 font-display text-3xl font-normal text-white sm:text-[2rem]"
            >
              {auth("title")}
            </DialogTitle>
            <DialogDescription className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {auth("description")}
            </DialogDescription>
            <Tabs
              value={shouldForceSignIn ? "sign-in" : tab}
              onValueChange={(value) => {
                setTab(value as AuthTab);
                setFormError(null);
                if (shouldForceSignIn) router.replace(pathname);
              }}
              className="mt-7"
            >
              <TabsList aria-label={auth("tabsLabel")}>
                <TabsTrigger value="sign-in">{auth("signIn")}</TabsTrigger>
                <TabsTrigger value="register">{auth("register")}</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">
                <form className="grid gap-6" noValidate onSubmit={handleSignIn}>
                  <Field
                    label={t("email")}
                    name="email"
                    field="email"
                    error={fieldErrors.email}
                    onBlur={(event) =>
                      validateField("email", event.currentTarget.value)
                    }
                    onChange={() => clearFieldError("email")}
                    type="email"
                    autoComplete="email"
                  />
                  <Field
                    label={auth("password")}
                    name="password"
                    field="password"
                    error={fieldErrors.password}
                    onBlur={(event) =>
                      validateField("password", event.currentTarget.value)
                    }
                    onChange={() => clearFieldError("password")}
                    type="password"
                    autoComplete="current-password"
                  />
                  <SubmitButton pending={isSubmitting}>
                    {auth("signIn")}
                  </SubmitButton>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form className="grid gap-7" noValidate onSubmit={handleSignUp}>
                  <div
                    className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-4"
                    role="group"
                    aria-label={t("choosePathway")}
                  >
                    {(Object.keys(pathwayKeys) as Pathway[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={pathway === key}
                        onClick={() => setPathway(key)}
                        className="min-h-11 text-xs text-muted transition-colors hover:text-white aria-pressed:text-signal aria-pressed:font-semibold"
                      >
                        {t(pathwayKeys[key])}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label={t("fullName")}
                      name="full-name"
                      field="fullName"
                      error={fieldErrors.fullName}
                      onBlur={(event) =>
                        validateField("fullName", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("fullName")}
                      autoComplete="name"
                    />
                    <Field
                      label={t("username")}
                      name="username"
                      field="username"
                      error={fieldErrors.username}
                      onBlur={(event) =>
                        validateField("username", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("username")}
                      autoComplete="username"
                    />
                    <Field
                      label={t("email")}
                      name="email"
                      field="email"
                      error={fieldErrors.email}
                      onBlur={(event) =>
                        validateField("email", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("email")}
                      type="email"
                      autoComplete="email"
                    />
                    <Field
                      label={t("phone")}
                      name="phone-number"
                      field="phone"
                      error={fieldErrors.phone}
                      onBlur={(event) =>
                        validateField("phone", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("phone")}
                      type="tel"
                      autoComplete="tel"
                    />
                    <Field
                      label={auth("password")}
                      name="password"
                      field="password"
                      error={fieldErrors.password}
                      onBlur={(event) =>
                        validateField("password", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("password")}
                      type="password"
                      autoComplete="new-password"
                      className="sm:col-span-2"
                    />
                  </div>
                  <p className="text-xs leading-6 text-muted">{t("privacy")}</p>
                  <SubmitButton pending={isSubmitting}>
                    {auth("createAccount")}
                  </SubmitButton>
                </form>
              </TabsContent>
            </Tabs>
            {formError && (
              <p
                className="mt-5 border-s-2 border-destructive ps-3 text-sm text-destructive"
                role="alert"
              >
                {formError}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </InterestContext.Provider>
  );
}

function SubmitButton({
  children,
  pending,
}: {
  children: ReactNode;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center bg-signal px-7 font-body text-sm text-ink transition-colors hover:bg-signal-light disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "…" : children}
    </button>
  );
}

function Field({
  label,
  name,
  field,
  type = "text",
  autoComplete,
  className,
  error,
  onBlur,
  onChange,
}: {
  label: string;
  name: string;
  field: AuthField;
  type?: string;
  autoComplete?: string;
  className?: string;
  error?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const errorId = `${field}-error`;

  return (
    <label
      className={`grid gap-2 text-[10px] uppercase tracking-[.12em] text-muted ${className ?? ""}`}
      htmlFor={name}
    >
      <span>{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onBlur={onBlur}
        onChange={onChange}
        className={`min-h-11 border-b bg-transparent px-0 text-sm normal-case tracking-normal text-text outline-none transition-colors focus:border-signal ${
          error ? "border-destructive" : "border-line"
        }`}
      />
      {error && (
        <span
          id={errorId}
          className="normal-case tracking-normal text-xs leading-5 text-destructive"
          aria-live="polite"
        >
          {error}
        </span>
      )}
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
