import React from "react";

export type SectionHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  titleClassName?: string;
  kicker?: React.ReactNode;
  rule?: boolean;
  lead?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  leadClassName?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  titleClassName = "text-fd-navy!",
  kicker,
  rule = true,
  lead,
  className = "",
  children,
  leadClassName,
}: SectionHeaderProps) {
  return (
    <div className={`mb-11 ${className}`.trim()}>
      {eyebrow && (
        <div className="text-[13px] font-semibold tracking-[0.12em] text-fd-gold uppercase mb-[18px]">
          {eyebrow}
        </div>
      )}
      <h2
        className={`font-serif font-medium text-[clamp(30px,3.6vw,42px)] leading-[1.12] tracking-[-0.01em] max-w-[24ch] [text-wrap:balance] ${titleClassName}`}
      >
        {title}
      </h2>
      {kicker && (
        <p className="font-serif text-[20px] leading-[1.5] text-fd-body mt-3.5">
          {kicker}
        </p>
      )}
      {rule && (
        <div className="w-14 h-[2px] bg-fd-gold my-6" aria-hidden="true" />
      )}
      {lead && (
        <p
          className={`text-[19px] leading-[1.6] text-fd-body max-w-[64ch] mt-4 ${leadClassName}`}
        >
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}
