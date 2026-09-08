export default function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-navy on-navy pb-24 pt-28 text-lbody sm:pt-36">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10">
        <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="mt-6 flex animate-pulse items-center gap-6 rounded-2xl border border-white/10 bg-deep p-8">
          <div className="size-20 rounded-full bg-white/10" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 rounded-full bg-white/10" />
            <div className="h-4 w-32 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-deep" />
          <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-deep" />
          <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-deep" />
        </div>
      </div>
    </main>
  );
}
