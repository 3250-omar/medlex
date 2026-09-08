import Container from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type PageSection = { eyebrow: string; title: string; body: string };
type EditorialPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PageSection[];
  cta?: { label: string; href: string };
};

export default function EditorialPage({
  eyebrow,
  title,
  intro,
  sections,
  cta,
}: EditorialPageProps) {
  return (
    <div className="min-h-screen bg-navy text-lbody">
      {/* Hero Header */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-navy on-navy pb-20 pt-36 text-white md:pb-28 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,175,55,0.08),transparent_70%)]"
        />
        <Container>
          <p className="kicker text-gold">
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl font-normal">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-lbody sm:text-lg">
            {intro}
          </p>
        </Container>
      </section>

      {/* Main Content Grid */}
      <section className="border-b border-hair bg-white py-20 text-char md:py-28">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {sections.map((section) => (
              <Card
                key={section.title}
                className="group rounded-2xl border border-hair bg-warm/30 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-md"
              >
                <CardHeader className="p-0">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-goldd">
                    {section.eyebrow}
                  </p>
                  <CardTitle className="mt-3 font-serif text-2xl font-normal leading-snug text-navy">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-4 p-0 font-sans text-sm leading-7 text-char/80">
                  {section.body}
                </CardContent>
              </Card>
            ))}
          </div>
          {cta && (
            <div className="mt-16 flex justify-center">
              <Link
                href={cta.href}
                className="btn btn-navy !rounded-full !px-8 !py-4 font-body text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-deep hover:shadow-md"
              >
                {cta.label} →
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
