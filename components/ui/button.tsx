import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const styles = `inline-flex min-h-11 items-center justify-center px-6 py-3 font-body text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${variant === "primary" ? "bg-signal text-ink hover:bg-signal-light" : "border border-ink/20 text-ink hover:border-ink/60 dark:border-white/20 dark:text-white dark:hover:border-white/60"} ${className}`;
  return href ? (
    <Link href={href} className={styles}>
      {children}
    </Link>
  ) : (
    <button className={styles}>{children}</button>
  );
}
