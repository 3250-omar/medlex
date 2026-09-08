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
    <span className="inline-flex h-12 items-center border-r border-gold/15 px-8 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-mute">
      {item}
    </span>
  ),
}));

export default function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-gold/15 bg-deep">
      <LogoLoop
        logos={marqueeItems}
        speed={42}
        direction="left"
        gap={0}
        fadeOut
        fadeOutColor="#142A49"
        ariaLabel="MedLex areas of expertise"
      />
    </div>
  );
}
