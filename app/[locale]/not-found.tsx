import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 bg-paper px-6 text-center">
      <div className="h-px w-16 bg-signal/50!" />
      <div>
        <p className="mb-2 font-body text-[9px] uppercase tracking-[0.3em] text-muted!">
          404 — Page not found
        </p>
        <h1 className="font-display text-4xl text-ink">
          This page does not exist.
        </h1>
        <p className="mt-4 font-body text-sm text-muted! max-w-sm mx-auto">
          The page you are looking for may have moved or may never have existed.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/en"
          className="bg-ink px-8 py-3 font-body text-sm text-white! transition-colors hover:bg-accent"
        >
          Return home
        </Link>
        <Link
          href="/en/pathways"
          className="border border-line px-8 py-3 font-body text-sm text-text! transition-colors hover:border-ink"
        >
          View pathways
        </Link>
      </div>
    </div>
  );
}
