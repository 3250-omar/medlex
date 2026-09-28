import Image from "next/image";
import { useMemo } from "react";

interface ArticleAuthorProps {
  authorName?: string;
  isRtl?: boolean;
}

function isDrAhmed(name?: string | null): boolean {
  if (!name) return true;
  const lower = name.toLowerCase();
  return (
    lower.includes("ahmed") ||
    lower.includes("abouelghit") ||
    name.includes("أحمد") ||
    name.includes("أبو الغيط")
  );
}

export function ArticleAuthor({
  authorName,
  isRtl = false,
}: ArticleAuthorProps) {
  const resolvedName = useMemo(() => {
    return authorName || (isRtl ? "د. أحمد أبو الغيط" : "Dr. Ahmed Abouelghit");
  }, [authorName, isRtl]);

  const isFounder = useMemo(() => isDrAhmed(authorName), [authorName]);

  const bio = useMemo(() => {
    if (isRtl) {
      return "استشاري الطب النفسي الشرعي ومؤسس ميدلكس. يكتب عن الممارسة الطبية القانونية وعمل الخبير أمام المحاكم والقيادة المؤسسية.";
    }
    return "Consultant Forensic Psychiatrist and founder of MedLex. Writes on medico-legal practice, expert witness work and institutional leadership.";
  }, [isRtl]);

  const initialLetter = useMemo(() => {
    if (isRtl) return "أ";
    return resolvedName.trim().charAt(0).toUpperCase() || "A";
  }, [isRtl, resolvedName]);

  return (
    <section className="flex flex-col sm:flex-row gap-5 items-start mt-14 p-7 border border-[#d6b03f]/25 rounded-[18px] bg-[#17305a]/80 shadow-lg">
      {isFounder ? (
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#d6b03f] shrink-0 shadow-md bg-[#0b1a30]">
          <Image
            src="/images/dr-ahmed-abouelghit.webp"
            alt={resolvedName}
            width={64}
            height={64}
            className="object-cover object-top w-full h-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="w-16 h-16 rounded-full bg-[#0b1a30] border border-[#d6b03f] flex items-center justify-center font-serif text-[#e8cd7a] text-2xl font-bold shrink-0 shadow-sm"
        >
          {initialLetter}
        </div>
      )}
      <div>
        <h3 className="font-serif text-[22px] font-medium text-[#f3efe4] mb-1.5 leading-snug">
          {resolvedName}
        </h3>
        <p className="text-[15px] text-[#a9b6cb] leading-relaxed max-w-[62ch]">
          {bio}
        </p>
      </div>
    </section>
  );
}
