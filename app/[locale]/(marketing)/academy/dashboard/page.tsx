import Link from "next/link";
import Container from "@/components/layout/Container";

export default function AcademyDashboardPage() {
  return (
    <div className="min-h-full bg-paper text-text">
      <Container className="py-32 md:py-40">
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-line pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.24em] text-signal">
              Academy / Dashboard preview
            </p>
            <h1 className="mt-4 font-display text-5xl leading-none md:text-6xl">
              Good to see you.
            </h1>
          </div>
          <span className="font-body text-sm text-muted">
            Learner workspace
          </span>
        </div>
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          <div className="border border-line bg-ink p-7 text-white md:p-9">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
              Continue learning
            </p>
            <h2 className="mt-4 max-w-md font-display text-3xl">
              Forensic Psychiatry Essentials
            </h2>
            <div className="mt-8 h-1 bg-white/10">
              <div className="h-full w-[42%] bg-signal" />
            </div>
            <div className="mt-3 flex justify-between font-body text-xs text-white/45">
              <span>Module 03 of 08</span>
              <span>42%</span>
            </div>
            <Link
              href="/academy/courses/expert-witness-forensic-psychiatry"
              className="mt-8 inline-flex min-h-11 items-center border border-signal px-5 py-3 font-body text-sm text-signal transition-colors hover:bg-signal hover:text-ink"
            >
              Continue module →
            </Link>
          </div>
          <div className="border border-line bg-surface p-7">
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
              Your record
            </p>
            <div className="mt-7 grid grid-cols-2 gap-6">
              <div>
                <p className="font-display text-4xl text-text">420</p>
                <p className="mt-1 font-body text-xs text-muted">
                  Points earned
                </p>
              </div>
              <div>
                <p className="font-display text-4xl text-text">01</p>
                <p className="mt-1 font-body text-xs text-muted">Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
