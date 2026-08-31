import Link from "next/link";
import Container from "@/components/layout/Container";
import FAQAccordion from "./_comp/FAQAccordion";

const FAQ_ITEMS = [
  { question: "Who is this platform for?", answer: "MedLex is designed for psychiatrists, clinicians, legal professionals, and institutions working where mental health meets the law." },
  { question: "What is the difference between the three pathways?", answer: "The pathways move from foundational concepts to practical report writing and advanced professional capability, so you can begin at the right level." },
  { question: "What happens after I register my interest?", answer: "We will share the next available dates, course guidance, and early access information relevant to your interests." },
  { question: "Are prices and dates published?", answer: "Course dates and pricing are published as each cohort opens. Register your interest to receive the announcement first." },
];

export default function FAQPage() {
  return <div className="min-h-full bg-ink text-white"><section className="border-b border-white/10 pb-16 pt-36 md:pb-24 md:pt-40"><Container><div className="mx-auto max-w-[855px]"><p className="reveal flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.25em] text-white/55"><span className="h-px w-7 bg-signal" /> MedLex <span className="text-signal">FAQ</span></p><h1 className="reveal reveal-delay-1 mt-6 max-w-3xl font-display text-5xl leading-[0.98] md:text-7xl">Questions asked<br />before registering.</h1><p className="reveal reveal-delay-2 mt-7 font-body text-sm leading-7 text-white/55">General answers about the platform and its three pathways.</p></div></Container></section><section className="py-20"><Container><div className="mx-auto max-w-[855px]"><FAQAccordion items={FAQ_ITEMS} /><Link href="/register" className="mt-7 inline-flex min-h-11 items-center bg-signal px-5 py-3 font-body text-xs tracking-wide text-ink transition-transform duration-300 hover:-translate-y-0.5 hover:bg-signal-light">Register your interest <span className="ml-4">→</span></Link></div></Container></section></div>;
}
