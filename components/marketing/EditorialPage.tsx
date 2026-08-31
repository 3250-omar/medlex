import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PageSection = { eyebrow: string; title: string; body: string };
type EditorialPageProps = { eyebrow: string; title: string; intro: string; sections: PageSection[]; cta?: { label: string; href: string } };

export default function EditorialPage({ eyebrow, title, intro, sections, cta }: EditorialPageProps) {
  return <div className="bg-paper text-text">
    <section className="border-b border-line bg-ink pb-20 pt-40 text-white md:pb-28"><Container>
      <p className="reveal font-body text-[10px] uppercase tracking-[0.28em] text-signal">{eyebrow}</p>
      <h1 className="reveal reveal-delay-1 mt-6 max-w-4xl font-display text-5xl leading-[0.98] md:text-7xl">{title}</h1>
      <p className="reveal reveal-delay-2 mt-8 max-w-2xl font-body text-base leading-8 text-white/60">{intro}</p>
    </Container></section>
    <section className="py-20 md:py-28"><Container>
      <div className="grid gap-6 md:grid-cols-3">{sections.map((section) => <Card key={section.title} eyebrow={section.eyebrow} title={section.title}>{section.body}</Card>)}</div>
      {cta && <div className="reveal mt-16 flex justify-center"><Button href={cta.href}>{cta.label} →</Button></div>}
    </Container></section>
  </div>;
}
