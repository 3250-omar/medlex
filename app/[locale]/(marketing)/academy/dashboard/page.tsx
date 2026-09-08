import Link from "next/link";
import Container from "@/components/layout/Container";

export default function AcademyDashboardPage() {
  return (
    <div className="min-h-screen bg-navy text-lbody">
      <Container className="py-32 md:py-44">
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="kicker text-gold">
              Academy / Dashboard preview
            </p>
            <h1 className="mt-4 font-serif text-4xl font-normal leading-tight text-white sm:text-5xl md:text-6xl">
              Good to see you.
            </h1>
          </div>
          <span className="font-sans text-sm text-mute">
            Learner workspace
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-deep p-8 shadow-sm md:p-10">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Continue learning
            </p>
            <h2 className="mt-4 max-w-md font-serif text-2xl font-normal text-white sm:text-3xl">
              Forensic Psychiatry Essentials
            </h2>
            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold w-[42%]" />
            </div>
            <div className="mt-3 flex justify-between font-sans text-xs text-mute">
              <span>Module 03 of 08</span>
              <span>42%</span>
            </div>
            <div className="mt-8">
              <Link
                href="/academy/courses/expert-witness-forensic-psychiatry"
                className="btn btn-gold !rounded-full !px-6 !py-3 font-body text-sm font-semibold text-navy inline-flex items-center gap-2"
              >
                Continue module →
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-deep p-8 shadow-sm md:p-10">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Your record
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-serif text-4xl font-normal text-white">420</p>
                <p className="mt-2 font-sans text-xs text-mute">
                  Points earned
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl font-normal text-white">01</p>
                <p className="mt-2 font-sans text-xs text-mute">Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
