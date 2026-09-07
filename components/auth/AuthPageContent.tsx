"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useSignInMutation,
  useSignUpMutation,
} from "@/components/marketing/authMutations";
import { academyQueryKeys } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import { signInSchema, signUpSchema } from "@/lib/auth/validation";
import { DatePicker } from "@/components/ui/datePicker";

export type AuthTab = "sign-in" | "register";
type AuthField = keyof typeof signUpSchema.shape;

function formatDateForForm(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export function AuthPageContent() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const t = useTranslations("registration");
  const auth = useTranslations("auth");

  // Read query params
  const tabParam = searchParams.get("tab");
  const defaultTab: AuthTab = tabParam === "sign-in" ? "sign-in" : "register";

  const redirectParam = searchParams.get("redirect");

  // Local state
  const [localTab, setLocalTab] = React.useState<AuthTab | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [examDate, setExamDate] = React.useState<Date>();

  const tab: AuthTab = localTab ?? defaultTab;

  const [formError, setFormError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<AuthField, string>>
  >({});
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  const signIn = useSignInMutation();
  const signUp = useSignUpMutation();

  const validationMessages: Record<AuthField, string> = {
    fullName: auth("validation.fullName"),
    username: auth("validation.username"),
    email: auth("validation.email"),
    phone: auth("validation.phone"),
    password: auth("validation.password"),
    examDate: auth("validation.examDate"),
  };

  function getFieldErrors(issues: { path: PropertyKey[] }[]) {
    return issues.reduce<Partial<Record<AuthField, string>>>(
      (errors, issue) => {
        const field = String(issue.path[0]) as AuthField;
        if (field in validationMessages) {
          errors[field] = validationMessages[field];
        }
        return errors;
      },
      {},
    );
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

  const handleTabChange = (nextTab: string) => {
    const resolved = nextTab as AuthTab;
    setLocalTab(resolved);
    setFormError(null);
    setSuccessNotice(null);
    setFieldErrors({});

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("pathway");
    currentParams.set("tab", resolved);
    router.replace(`/${locale}/auth?${currentParams.toString()}`, {
      scroll: false,
    });
  };

  async function handleSuccess(result: {
    requiresEmailConfirmation?: boolean;
  }) {
    if (result.requiresEmailConfirmation) {
      setSuccessNotice(auth("confirmationRequired"));
      setFormError(null);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: academyQueryKeys.currentUser,
    });

    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//")
    ) {
      router.push(redirectParam);
    } else {
      router.push(`/${locale}/courses`);
    }
    router.refresh();
  }

  function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessNotice(null);

    const formData = new FormData(event.currentTarget);
    const input = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    const validation = signInSchema.safeParse(input);
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error.issues));
      return;
    }

    signIn.mutate(validation.data, {
      onSuccess: (result) => void handleSuccess(result),
      onError: (error) => setFormError(error.message),
    });
  }

  function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessNotice(null);

    const formData = new FormData(event.currentTarget);
    const input = {
      fullName: String(formData.get("full-name") ?? "").trim(),
      username: String(formData.get("username") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone-number") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      examDate: String(formData.get("exam-date") ?? ""),
    };

    const validation = signUpSchema.safeParse(input);
    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error.issues));
      return;
    }

    signUp.mutate(validation.data, {
      onSuccess: (result) => void handleSuccess(result),
      onError: (error) => setFormError(error.message),
    });
  }

  const isSubmitting = signIn.isPending || signUp.isPending;

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      {/* Background Decorative Guilloche & Aura Elements */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Soft Radial Ambient Glows */}
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-signal/[0.045] blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/4 size-[500px] rounded-full bg-accent-2/[0.08] blur-[140px]" />

        {/* Delicate Security Concentric Rings (Medlex Signature Pattern) */}
        <svg
          className="absolute right-[-10%] top-[-5%] size-[700px] opacity-[0.06] text-signal"
          viewBox="0 0 700 700"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="350" cy="350" r="120" strokeWidth="0.8" />
          <circle
            cx="350"
            cy="350"
            r="180"
            strokeWidth="0.7"
            strokeDasharray="3 4"
          />
          <circle cx="350" cy="350" r="240" strokeWidth="0.8" />
          <circle
            cx="350"
            cy="350"
            r="300"
            strokeWidth="0.6"
            strokeDasharray="6 6"
          />
          <circle cx="350" cy="350" r="340" strokeWidth="0.8" />
          <line
            x1="350"
            y1="10"
            x2="350"
            y2="690"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="10"
            y1="350"
            x2="690"
            y2="350"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      {/* Main 2-Column Responsive Container */}
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Editorial Context & Trust           */}
          {/* ============================================================ */}
          <div className="hidden lg:flex flex-col gap-8 lg:col-span-5 pe-2">
            {/* Top Eyebrow with hairline gold rule */}
            <div className="flex items-center gap-3.5">
              <span className="block h-px w-10 bg-signal/70" />
              <span className="font-body text-[10.5px] uppercase tracking-[0.28em] text-signal font-semibold">
                MEDLEX PORTAL & ACCESS
              </span>
            </div>

            {/* Editorial Title */}
            <div>
              <h1 className="font-display text-4xl xl:text-[2.85rem] font-normal text-text leading-[1.12] tracking-tight">
                The standard of{" "}
                <span className="italic text-signal font-serif">forensic</span>{" "}
                & medicolegal practice.
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-muted max-w-[42ch]">
                {auth("description")}
              </p>
            </div>

            <div className="rounded-2xl border border-line/60 bg-surface/45 p-5 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal">
                Built for practice
              </p>
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">
                One MedLex account keeps your professional learning, course
                progress, and certificates together.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-text">
                <span className="size-1.5 rounded-full bg-signal" />
                Simple registration. Access is tailored after sign-in.
              </div>
            </div>
            {/* Institutional Trust Badge */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-line/60 bg-surface/40 backdrop-blur-md">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-signal/10 border border-signal/25 text-signal">
                <ShieldCheck className="size-5" />
              </div>
              <div className="text-xs">
                <p className="font-medium text-text">
                  Specialised Clinical Education
                </p>
                <p className="text-muted text-[11px] leading-snug mt-0.5">
                  Serving clinicians, courts, and health authorities across the
                  UK and MENA region.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Luxury Auth Card Portal                        */}
          {/* ============================================================ */}
          <div className="w-full lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-line/90 bg-surface/95 p-5 shadow-2xl shadow-ink/80 ring-1 ring-white/10 backdrop-blur-2xl sm:p-8 md:p-10">
              <div
                className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent"
                aria-hidden="true"
              />

              {/* Header inside Card */}
              <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-line/70">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-2 rounded-full bg-signal animate-pulse motion-reduce:animate-none" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-signal">
                    MedLex Authentication
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-muted">
                  <span className="border border-line rounded px-1.5 py-0.5 uppercase tracking-widest text-[10px]">
                    {locale}
                  </span>
                </div>
              </div>

              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-signal">
                  {tab === "sign-in" ? "Welcome back" : "New to MedLex"}
                </p>
                <h2 className="mt-2 font-display text-2xl font-normal tracking-tight text-text sm:text-[1.75rem]">
                  {tab === "sign-in"
                    ? "Continue your professional learning"
                    : "Create your MedLex account"}
                </h2>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted">
                  {tab === "sign-in"
                    ? "Sign in to pick up your courses, progress, and certificates."
                    : "Set up one secure profile to keep your learning records together."}
                </p>
              </div>

              {/* Segmented Switcher Tabs */}
              <Tabs
                value={tab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList
                  aria-label={auth("tabsLabel")}
                  className="grid w-full grid-cols-2 rounded-2xl border border-line bg-surface-2/70 p-1.5"
                >
                  <TabsTrigger
                    value="sign-in"
                    className={cn(
                      "min-h-11 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/60",
                      "data-[state=active]:bg-surface data-[state=active]:text-signal data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-line",
                      "data-[state=inactive]:text-muted data-[state=inactive]:hover:text-text",
                    )}
                  >
                    {auth("signIn")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className={cn(
                      "min-h-11 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/60",
                      "data-[state=active]:bg-surface data-[state=active]:text-signal data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-line",
                      "data-[state=inactive]:text-muted data-[state=inactive]:hover:text-text",
                    )}
                  >
                    {auth("register")}
                  </TabsTrigger>
                </TabsList>

                {/* Success Alert Banner */}
                {successNotice && (
                  <div
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300 shadow-sm"
                    role="status"
                  >
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-400 mt-0.5" />
                    <p className="leading-relaxed text-xs sm:text-sm">
                      {successNotice}
                    </p>
                  </div>
                )}

                {/* Error Alert Banner */}
                {formError && (
                  <div
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive shadow-sm"
                    role="alert"
                  >
                    <div className="size-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                    <p className="leading-relaxed text-xs sm:text-sm">
                      {formError}
                    </p>
                  </div>
                )}

                {/* ====================================================== */}
                {/* SIGN IN TAB CONTENT                                    */}
                {/* ====================================================== */}
                <TabsContent
                  value="sign-in"
                  className="mt-7 focus-visible:outline-none"
                >
                  <form
                    className="grid gap-5"
                    noValidate
                    onSubmit={handleSignIn}
                  >
                    <AuthInputField
                      label={t("email")}
                      name="email"
                      field="email"
                      icon={<Mail className="size-4 text-muted" />}
                      error={fieldErrors.email}
                      onBlur={(event) =>
                        validateField("email", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="name@institution.com"
                    />

                    <AuthInputField
                      label={auth("password")}
                      name="password"
                      field="password"
                      icon={<Lock className="size-4 text-muted" />}
                      error={fieldErrors.password}
                      onBlur={(event) =>
                        validateField("password", event.currentTarget.value)
                      }
                      onChange={() => clearFieldError("password")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="rounded-md p-2 text-muted transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      }
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "group relative mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 font-body text-sm font-semibold text-ink shadow-lg shadow-signal/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                        "hover:bg-signal-light hover:shadow-xl hover:shadow-signal/25 active:bg-signal",
                        "disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                          <span>Signing in...</span>
                        </span>
                      ) : (
                        <>
                          <span>{auth("signIn")}</span>
                          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    {/* Switcher Footer */}
                    <div className="flex flex-col items-start gap-2 border-t border-line/60 pt-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                      <span>Don&apos;t have an account?</span>
                      <button
                        type="button"
                        onClick={() => handleTabChange("register")}
                        className="rounded-md font-semibold text-signal transition-colors hover:text-signal-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 cursor-pointer"
                      >
                        {auth("register")}
                      </button>
                    </div>
                  </form>
                </TabsContent>

                {/* ====================================================== */}
                {/* REGISTER TAB CONTENT                                   */}
                {/* ====================================================== */}
                <TabsContent
                  value="register"
                  className="mt-7 focus-visible:outline-none"
                >
                  <form
                    className="grid gap-5 sm:gap-6"
                    noValidate
                    onSubmit={handleSignUp}
                  >
                    <div className="rounded-2xl border border-line/70 bg-surface-2/35 p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal">
                            Create your profile
                          </p>
                          <h3 className="mt-1 font-display text-lg text-text">
                            Start learning with MedLex
                          </h3>
                        </div>
                        <ShieldCheck
                          className="size-5 shrink-0 text-signal"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        Your account securely keeps your learning progress and
                        certificates in one place.
                      </p>
                    </div>
                    {/* Inputs Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AuthInputField
                        label={t("fullName")}
                        name="full-name"
                        field="fullName"
                        icon={<User className="size-4 text-muted" />}
                        error={fieldErrors.fullName}
                        onBlur={(event) =>
                          validateField("fullName", event.currentTarget.value)
                        }
                        onChange={() => clearFieldError("fullName")}
                        autoComplete="name"
                        placeholder="Dr. John Doe"
                      />

                      <AuthInputField
                        label={t("username")}
                        name="username"
                        field="username"
                        icon={<Sparkles className="size-4 text-muted" />}
                        error={fieldErrors.username}
                        onBlur={(event) =>
                          validateField("username", event.currentTarget.value)
                        }
                        onChange={() => clearFieldError("username")}
                        autoComplete="username"
                        placeholder="johndoe"
                      />

                      <AuthInputField
                        label={t("email")}
                        name="email"
                        field="email"
                        icon={<Mail className="size-4 text-muted" />}
                        error={fieldErrors.email}
                        onBlur={(event) =>
                          validateField("email", event.currentTarget.value)
                        }
                        onChange={() => clearFieldError("email")}
                        type="email"
                        autoComplete="email"
                        placeholder="john@example.com"
                      />

                      <AuthInputField
                        label={t("phone")}
                        name="phone-number"
                        field="phone"
                        icon={<Phone className="size-4 text-muted" />}
                        error={fieldErrors.phone}
                        onBlur={(event) =>
                          validateField("phone", event.currentTarget.value)
                        }
                        onChange={() => clearFieldError("phone")}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+44 7000 000000"
                      />
                      <div className="flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                        <label htmlFor="exam-date">{auth("examDate")}</label>
                        <input
                          type="hidden"
                          name="exam-date"
                          value={
                            examDate ? formatDateForForm(examDate) : ""
                          }
                        />
                        <DatePicker
                          id="exam-date"
                          value={examDate}
                          onChange={(date) => {
                            setExamDate(date);
                            clearFieldError("examDate");
                          }}
                          placeholder={auth("examDatePlaceholder")}
                          className={cn(
                            fieldErrors.examDate &&
                              "border-destructive bg-destructive/5 text-destructive",
                          )}
                        />
                        {fieldErrors.examDate && (
                          <span
                            id="examDate-error"
                            className="mt-0.5 normal-case tracking-normal text-xs text-destructive"
                            aria-live="polite"
                          >
                            {fieldErrors.examDate}
                          </span>
                        )}
                      </div>
                      <AuthInputField
                        label={auth("password")}
                        name="password"
                        field="password"
                        icon={<Lock className="size-4 text-muted" />}
                        error={fieldErrors.password}
                        onBlur={(event) =>
                          validateField("password", event.currentTarget.value)
                        }
                        onChange={() => clearFieldError("password")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="sm:col-span-2! md:col-span-1!"
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="rounded-md p-2 text-muted transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        }
                      />
                    </div>

                    <p className="rounded-xl border border-line/60 bg-surface-2/25 px-3.5 py-3 text-[11.5px] leading-relaxed text-muted/90">
                      {t("privacy")}
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "group relative flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 font-body text-sm font-semibold text-ink shadow-lg shadow-signal/20 transition-all duration-200",
                        "hover:bg-signal-light hover:shadow-xl hover:shadow-signal/25 active:bg-signal",
                        "disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
                      )}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                          <span>Creating account...</span>
                        </span>
                      ) : (
                        <>
                          <span>{auth("createAccount")}</span>
                          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    {/* Switcher Footer */}
                    <div className="flex flex-col items-start gap-2 border-t border-line/60 pt-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                      <span>Already have an account?</span>
                      <button
                        type="button"
                        onClick={() => handleTabChange("sign-in")}
                        className="rounded-md font-semibold text-signal transition-colors hover:text-signal-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/50 cursor-pointer"
                      >
                        {auth("signIn")}
                      </button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <Link
                href={`/${locale}`}
                className="group inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-signal"
              >
                <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Return to MedLex Overview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthInputField({
  label,
  name,
  field,
  type = "text",
  autoComplete,
  className,
  error,
  icon,
  trailing,
  placeholder,
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
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  placeholder?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const errorId = `${field}-error`;

  return (
    <label
      className={cn(
        "flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted",
        className,
      )}
      htmlFor={name}
    >
      <span>{label}</span>
      <div className="relative flex items-center rounded-xl transition-shadow focus-within:ring-2 focus-within:ring-signal/20">
        {icon && (
          <span
            className="pointer-events-none absolute start-3.5 flex items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onBlur={onBlur}
          onChange={onChange}
          className={cn(
            "min-h-12 w-full rounded-xl border bg-surface-2/40 px-3.5 text-sm normal-case tracking-normal text-text outline-none transition-all duration-200 placeholder:text-muted/70",
            icon && "ps-10",
            trailing && "pe-10",
            "focus:border-signal focus:bg-surface-2/70 focus:ring-2 focus:ring-signal/30",
            error
              ? "border-destructive bg-destructive/5 text-destructive focus:border-destructive focus:ring-destructive/30"
              : "border-line hover:border-line/90",
          )}
        />
        {trailing && (
          <span className="absolute end-3 flex items-center justify-center">
            {trailing}
          </span>
        )}
      </div>
      {error && (
        <span
          id={errorId}
          className="normal-case tracking-normal text-xs text-destructive mt-0.5"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </label>
  );
}

export default AuthPageContent;
