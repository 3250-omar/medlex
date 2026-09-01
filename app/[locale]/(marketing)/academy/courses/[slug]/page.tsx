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
    <div className="min-h-full bg-paper text-text">
      <section className="bg-ink pb-20 pt-36 text-white md:pb-28">
        <Container>
          <p className="font-body text-[10px] uppercase tracking-[0.24em] text-signal">
            Academy / Course
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.98] md:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl font-body text-base leading-8 text-white/60">
            A structured learning path for professionals who need their
            reasoning to remain clear when the stakes are high.
          </p>
        </Container>
      </section>
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
                Your next lesson
              </p>
              <h2 className="mt-4 font-display text-4xl">
                Writing the defensible report
              </h2>
              <p className="mt-5 max-w-xl font-body text-sm leading-8 text-muted">
                Work through the principles, examples, and decision points that
                make a report useful to clinicians, courts, and the people it
                describes.
              </p>
              <Link
                href="/academy/dashboard"
                className="mt-8 inline-flex min-h-11 items-center bg-signal px-6 py-3 font-body text-sm text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:bg-signal-light"
              >
                Open lesson →
              </Link>
            </div>
            <aside className="border border-line bg-surface p-7">
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
                Course progress
              </p>
              <p className="mt-5 font-display text-5xl">42%</p>
              <div className="mt-5 h-1 bg-line">
                <div className="h-full w-[42%] bg-signal" />
              </div>
              <p className="mt-3 font-body text-xs text-muted">
                3 of 8 modules complete
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
