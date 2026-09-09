import Link from "next/link";
import { btnNavy } from "./EnrolOrContinue";

type Props = {
  locale: string;
};

export default function CascFreeStationPreviewSection({ locale }: Props) {
  return (
    <section id="free" className="py-14 border-b border-hair bg-white">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10">
        <div className="flex flex-col items-start md:items-center justify-between gap-6 rounded-2xl border border-hair p-8 sm:p-10 bg-white shadow-sm">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy!">
              See a station before you decide.
            </h3>
            <p className="mt-2 text-base text-grey max-w-2xl leading-relaxed">
              Station 7.2 — the one above — is open to anyone, no login. Read
              it fail twice, read it pass, tap the examiner&apos;s reasoning,
              then make the seven decisions yourself.
            </p>
          </div>
          <Link
            href={`/${locale}/academy/preview/station-7-2`}
            className={btnNavy}
          >
            Open Station 7.2 — free
          </Link>
        </div>
      </div>
    </section>
  );
}
