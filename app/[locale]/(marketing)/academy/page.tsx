import Link from "next/link";
import Container from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-navy text-lbody">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy on-navy pb-20 pt-36 text-white md:pb-28 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)]"
        />
        <Container>
          <p className="kicker text-gold">
            The MedLex Academy
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-normal leading-[1.05] text-white sm:text-5xl md:text-6xl">
            A calmer way to keep learning.
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
            Your courses, progress, points, and certificates in one focused
            learning space.
          </p>
        </Container>
      </section>
      <section className="border-b border-hair bg-white py-20 text-char md:py-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="rounded-2xl border border-hair bg-warm/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-md">
              <CardHeader className="p-0">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-goldd">
                  01 / Continue
                </p>
                <CardTitle className="mt-3 font-serif text-2xl font-normal text-navy">
                  Pick up where you left off
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 p-0 font-sans text-sm leading-7 text-char/80">
                Resume a lesson, see your next action, and keep your learning
                momentum visible.
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-hair bg-warm/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-md">
              <CardHeader className="p-0">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-goldd">
                  02 / Prove
                </p>
                <CardTitle className="mt-3 font-serif text-2xl font-normal text-navy">
                  Complete with confidence
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 p-0 font-sans text-sm leading-7 text-char/80">
                Structured checkpoints and exam modes turn knowledge into a
                documented achievement.
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-hair bg-warm/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-md">
              <CardHeader className="p-0">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-goldd">
                  03 / Carry
                </p>
                <CardTitle className="mt-3 font-serif text-2xl font-normal text-navy">
                  Take your record with you
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 p-0 font-sans text-sm leading-7 text-char/80">
                Certificates, points, and course history stay connected to your
                professional journey.
              </CardContent>
            </Card>
          </div>
          <div className="mt-16 flex justify-center">
            <Link
              href="/courses"
              className="btn btn-navy !rounded-full !px-8 !py-4 font-body text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-deep hover:shadow-md"
            >
              View the catalogue →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
