export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 before:h-px before:w-7 before:bg-signal">
      {children}
    </p>
  );
}
