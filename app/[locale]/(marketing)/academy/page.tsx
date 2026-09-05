import Link from "next/link";
import Container from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AcademyPage() {
  return (
    <div className="min-h-full bg-paper text-text">
      <section className="border-b border-line bg-ink pb-20 pt-40 text-white md:pb-28">
        <Container>
          <p className="reveal font-body text-[10px] uppercase tracking-[0.28em] text-signal">
            The MedLex Academy
          </p>
          <h1 className="reveal reveal-delay-1 mt-6 max-w-4xl font-display text-5xl leading-[0.98] md:text-7xl">
            A calmer way to keep learning.
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-2xl font-body text-base leading-8 text-white/60">
            Your courses, progress, points, and certificates in one focused
            learning space.
          </p>
        </Container>
      </section>
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-none border-line bg-surface shadow-none">
              <CardHeader>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
                  01 / Continue
                </p>
                <CardTitle className="font-display text-2xl font-normal">
                  Pick up where you left off
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body text-sm leading-7 text-muted">
                Resume a lesson, see your next action, and keep your learning
                momentum visible.
              </CardContent>
            </Card>
            <Card className="rounded-none border-line bg-surface shadow-none">
              <CardHeader>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
                  02 / Prove
                </p>
                <CardTitle className="font-display text-2xl font-normal">
                  Complete with confidence
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body text-sm leading-7 text-muted">
                Structured checkpoints and exam modes turn knowledge into a
                documented achievement.
              </CardContent>
            </Card>
            <Card className="rounded-none border-line bg-surface shadow-none">
              <CardHeader>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-signal">
                  03 / Carry
                </p>
                <CardTitle className="font-display text-2xl font-normal">
                  Take your record with you
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body text-sm leading-7 text-muted">
                Certificates, points, and course history stay connected to your
                professional journey.
              </CardContent>
            </Card>
          </div>
          <Link
            href="/courses"
            className="mt-14 inline-flex min-h-11 items-center bg-signal px-7 py-3 font-body text-sm tracking-wide text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:bg-signal-light"
          >
            View the catalogue →
          </Link>
        </Container>
      </section>
    </div>
  );
}
