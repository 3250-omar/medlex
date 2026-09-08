import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-navy on-navy px-6 text-center text-lbody">
      <div className="h-px w-16 bg-gold/50" />
      <div>
        <p className="kicker text-gold mb-3">
          404 — Page not found
        </p>
        <h1 className="font-serif text-4xl font-normal text-white sm:text-5xl">
          This page does not exist.
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-lbody max-w-sm mx-auto">
          The page you are looking for may have moved or may never have existed.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/en"
          className="btn btn-gold !rounded-full !px-8 !py-3.5 text-sm font-semibold text-navy inline-flex items-center justify-center"
        >
          Return home
        </Link>
        <Link
          href="/en/pathways"
          className="btn btn-ghost !rounded-full !px-8 !py-3.5 text-sm font-semibold text-white inline-flex items-center justify-center"
        >
          View pathways
        </Link>
      </div>
    </div>
  );
}
