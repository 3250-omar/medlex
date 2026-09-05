import { BookOpen } from "lucide-react";
import EnrolledCourses from "./_comps/EnrolledCourses";

export default function CoursesPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink pb-24 pt-28 text-white sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 border-b border-white/5 bg-white/[0.015]"
      />

      <section className="relative mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="max-w-3xl">
          <h1 className="mt-6 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            Your courses
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/65">
            Continue from where you left off, see your momentum at a glance, and
            return to the work that matters to you.
          </p>
        </div>

        <div className="mt-10 pt-8 sm:mt-12 sm:pt-10">
          <EnrolledCourses />
        </div>
      </section>
    </main>
  );
}
