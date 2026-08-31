type CardProps = { eyebrow?: string; title: string; children: React.ReactNode };

export function Card({ eyebrow, title, children }: CardProps) {
  return (
    <article className="reveal border border-line bg-surface p-7 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(11,26,46,0.08)]">
      {eyebrow && (
        <p className="mb-4 font-body text-[10px] uppercase tracking-[0.22em] text-signal">
          {eyebrow}
        </p>
      )}
      <h3 className="font-display text-2xl text-text">{title}</h3>
      <div className="mt-4 font-body text-sm leading-7 text-muted">
        {children}
      </div>
    </article>
  );
}
