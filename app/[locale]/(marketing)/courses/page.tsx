import EnrolledCourses from "./_comps/EnrolledCourses";

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-ink pb-20 pt-28 text-white sm:pt-36">
      <section className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[.2em] text-signal">Your learning</p>
        <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">Your courses</h1>
        <p className="mt-5 max-w-2xl font-body leading-7 text-white/65">Continue the courses you are enrolled in and return to your learning at any time.</p>
        <div className="mt-12"><EnrolledCourses /></div>
      </section>
    </main>
  );
}
