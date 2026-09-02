import Container from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
    <div className="bg-paper text-text">
      <section className="border-b border-line bg-ink pb-20 pt-40 text-white md:pb-28">
        <Container>
          <p className="reveal font-body text-[10px] uppercase tracking-[0.28em] text-signal">
            {eyebrow}
          </p>
          <h1 className="reveal reveal-delay-1 mt-6 max-w-4xl font-display text-5xl leading-[0.98] md:text-7xl">
            {title}
          </h1>
          <p className="reveal reveal-delay-2 mt-8 max-w-2xl font-body text-base leading-8 text-white/60">
            {intro}
          </p>
        </Container>
      </section>
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {sections.map((section) => (
              <Card
                key={section.title}
                className="reveal rounded-none border border-line bg-surface shadow-none transition-transform duration-300 hover:-translate-y-1"
              >
                <CardHeader className="px-7 pt-7">
                  <p className="font-body text-[10px] uppercase tracking-[0.22em] text-signal">
                    {section.eyebrow}
                  </p>
                  <CardTitle className="mt-3 font-display text-2xl font-normal text-text">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-7 pb-7 font-body text-sm leading-7 text-muted">
                  {section.body}
                </CardContent>
              </Card>
            ))}
          </div>
          {cta && (
            <div className="reveal mt-16 flex justify-center">
              <Link
                href={cta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-none bg-signal px-7 font-body text-sm tracking-wide text-ink hover:bg-signal-light",
                )}
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
