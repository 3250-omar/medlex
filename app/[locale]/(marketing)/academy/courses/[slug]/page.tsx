import Link from "next/link";
import Container from "@/components/layout/Container";

export default async function AcademyCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title =
    slug === "expert-witness-forensic-psychiatry"
      ? "Forensic Psychiatry Essentials"
      : "CASC Academy";
  return (
    <div className="min-h-screen bg-navy text-lbody">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy on-navy pb-20 pt-36 text-white md:pb-28 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)]"
        />
        <Container>
          <p className="kicker text-gold">Academy / Course</p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-normal leading-[1.05] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
            A structured learning path for professionals who need their
            reasoning to remain clear when the stakes are high.
          </p>
        </Container>
      </section>
      <section className="border-b border-hair bg-white py-20 text-char md:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="kicker text-goldd">Your next lesson</p>
              <h2 className="mt-4 font-serif text-3xl font-normal text-navy sm:text-4xl">
                Writing the defensible report
              </h2>
              <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-char/80">
                Work through the principles, examples, and decision points that
                make a report useful to clinicians, courts, and the people it
                describes.
              </p>
              <div className="mt-8">
                <Link
                  href="/academy/dashboard"
                  className="btn btn-navy !rounded-full !px-8 !py-3.5 font-body text-sm font-semibold text-white inline-flex items-center gap-2"
                >
                  Open lesson →
                </Link>
              </div>
            </div>
            <aside className="rounded-2xl border border-hair bg-warm/30 p-8 shadow-sm">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-goldd">
                Course progress
              </p>
              <p className="mt-4 font-serif text-5xl font-normal text-navy">
                42%
              </p>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-hair">
                <div className="h-full rounded-full bg-gold w-[42%]" />
              </div>
              <p className="mt-3 font-sans text-xs text-char/70">
                3 of 8 modules complete
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
