export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-gold before:h-px before:w-7 before:bg-gold">
      {children}
    </p>
  );
}
