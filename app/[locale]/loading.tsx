export default function LocaleLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-paper"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated diamond mark */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="animate-pulse"
          aria-hidden="true"
        >
          <path
            d="M16 2L30 16L16 30L2 16L16 2Z"
            stroke="var(--signal)"
            strokeWidth="1"
          />
          <path
            d="M16 8L24 16L16 24L8 16L16 8Z"
            fill="var(--signal)"
            opacity="0.3"
          />
        </svg>
        <span className="font-body text-[9px] uppercase tracking-[0.3em] text-muted">
          Loading
        </span>
      </div>
    </div>
  );
}
