"use client";

import { useState } from "react";

type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="flex flex-col gap-3">{items.map((item, index) => { const isOpen = open === index; return <div key={item.question} className="border border-white/15 bg-white/[0.035] transition-colors duration-300 hover:border-white/30"><button type="button" className="flex min-h-20 w-full items-center gap-5 px-6 py-5 text-left md:gap-10" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}><span className="w-12 shrink-0 font-display text-3xl text-signal md:w-16">{String(index + 1).padStart(2, "0")}</span><span className="flex-1 font-display text-lg text-white md:text-xl">{item.question}</span><span className={`relative h-5 w-5 shrink-0 text-signal transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true"><span className="absolute left-0 top-1/2 h-px w-5 bg-current" /><span className="absolute left-1/2 top-0 h-5 w-px bg-current" /></span></button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden"><p className="border-t border-white/10 px-6 py-5 pl-[5.5rem] font-body text-sm leading-7 text-white/55 md:pl-32">{item.answer}</p></div></div></div>; })}</div>;
}
