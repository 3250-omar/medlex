"use client";

import LogoLoop from "@/components/LogoLoop";

const ITEMS = [
  "MEDICO-LEGAL EDUCATION",
  "COURT-READY REPORTING STANDARDS",
  "UK-TRAINED CONSULTANT LEADERSHIP",
  "THE CASC ACADEMY",
  "MEDLEX FOUNDATIONS",
  "CRIMINAL RESPONSIBILITY ASSESSMENT",
  "EXPERT WITNESS TESTIMONY",
  "FORENSIC PSYCHIATRIC EVALUATION",
];

const marqueeItems = ITEMS.map((item) => ({
  ariaLabel: item,
  node: (
    <span className="inline-flex h-12 items-center border-r border-white/10 px-8 font-body text-[10px] uppercase tracking-[0.22em] text-white/55">
      {item}
    </span>
  ),
}));

export default function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#10283e]">
      <LogoLoop
        logos={marqueeItems}
        speed={42}
        direction="left"
        gap={0}
        fadeOut
        fadeOutColor="#10283e"
        ariaLabel="MedLex areas of expertise"
      />
    </div>
  );
}