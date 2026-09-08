"use client";

import { useMemo } from "react";
import { Check, FileText, Layers, Stethoscope } from "lucide-react";
import CollapsedMenu, {
  type CollapsedMenuGroup,
  type CollapsedMenuItem,
} from "@/components/CollapsedMenu";
import type { CourseOutline } from "../_apiCalls/learningQueries";

type CourseLessonMenuProps = {
  courseSlug: string;
  currentUnitSlug: string;
  locale: string;
  outline: CourseOutline;
};

type LessonCategory = "domains" | "stations";

function isCompleted(status: string | null, progressPercent: number) {
  return status === "completed" || progressPercent >= 100;
}

function getCategory(slug: string): LessonCategory {
  if (slug.startsWith("domain")) return "domains";
  if (slug.startsWith("station")) return "stations";
  return "domains";
}

export default function CourseLessonMenu({
  courseSlug,
  currentUnitSlug,
  locale,
  outline,
}: CourseLessonMenuProps) {
  const lessonIndexBySlug = useMemo(
    () => new Map(outline.units.map((unit, index) => [unit.slug, index])),
    [outline.units],
  );

  const completedCount = outline.units.filter((u) =>
    isCompleted(u.status, u.progressPercent),
  ).length;

  const menuGroups: CollapsedMenuGroup[] = useMemo(() => {
    const rawGroups: Record<
      LessonCategory,
      {
        key: LessonCategory;
        label: string;
        icon: React.ReactNode;
        units: CourseOutline["units"];
      }
    > = {
      domains: {
        key: "domains",
        label: "Domains",
        icon: <Layers size={13} className="text-gold" />,
        units: [],
      },
      stations: {
        key: "stations",
        label: "Stations",
        icon: <Stethoscope size={13} className="text-gold" />,
        units: [],
      },
    };

    for (const unit of outline.units) {
      rawGroups[getCategory(unit.slug)].units.push(unit);
    }

    return Object.values(rawGroups)
      .filter((group) => group.units.length > 0)
      .map((group) => {
        const completedInGroup = group.units.filter((u) =>
          isCompleted(u.status, u.progressPercent),
        ).length;

        const hasActiveUnit = group.units.some(
          (u) => u.slug === currentUnitSlug,
        );

        const items: CollapsedMenuItem[] = group.units.map((lesson) => {
          const lessonIndex = lessonIndexBySlug.get(lesson.slug) ?? 0;
          const completed = isCompleted(lesson.status, lesson.progressPercent);
          const isCurrent = lesson.slug === currentUnitSlug;
          const lessonNumber = lessonIndex + 1;

          return {
            id: lesson.slug,
            title: (
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs font-semibold text-text">
                  {lesson.title}
                </span>
                <span className="text-[10px] text-muted truncate">
                  {completed
                    ? "Completed"
                    : isCurrent
                      ? "Current lesson"
                      : "Available"}
                </span>
              </div>
            ),
            icon: completed ? (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs"
                title="Completed"
              >
                <Check size={13} strokeWidth={2.5} />
              </span>
            ) : isCurrent ? (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold text-navy font-bold text-xs shadow-xs shadow-gold/40"
                title={`Lesson ${lessonNumber} (Current)`}
              >
                {lessonNumber}
              </span>
            ) : (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 border border-line text-text group-hover:text-gold font-semibold text-xs transition-colors"
                title={`Lesson ${lessonNumber}`}
              >
                {lessonNumber}
              </span>
            ),
            badge: completed ? (
              <span className="flex items-center text-emerald-400 text-[10px] font-semibold">
                <Check size={11} className="mr-0.5" /> Done
              </span>
            ) : isCurrent ? (
              <span className="text-gold text-[10px] font-semibold">
                Active
              </span>
            ) : undefined,
            href: `/${locale}/academy/courses/${courseSlug}/learn/${lesson.slug}`,
          };
        });

        return {
          key: group.key,
          label: group.label,
          icon: group.icon,
          badge: `${completedInGroup}/${group.units.length}`,
          defaultExpanded: hasActiveUnit,
          items,
        };
      });
  }, [outline.units, lessonIndexBySlug, currentUnitSlug, locale, courseSlug]);

  const totalUnits = Math.max(1, outline.units.length);
  const progressPercent = Math.round((completedCount / totalUnits) * 100);

  return (
    <aside
      className="casc-lesson-menu !p-0 !border-0 !bg-transparent !shadow-none"
      aria-label="Course lessons navigation"
    >
      <CollapsedMenu
        groups={menuGroups}
        topAction={{
          label: "View workbook",
          href: "/gifts/Twelve%20Weeks%20to%20the%20CASC.pdf",
          icon: <FileText size={16} />,
        }}
        value={currentUnitSlug}
        expandedWidthClassName="w-72"
        collapsedWidthClassName="w-[64px]"
        variant="card"
        footer={({ isCollapsed }) =>
          isCollapsed ? (
            <span
              className="font-body text-xs font-bold text-gold select-none"
              title={`Progress: ${progressPercent}% (${completedCount}/${outline.units.length})`}
            >
              {progressPercent}%
            </span>
          ) : (
            <div className="flex items-center justify-between text-[11px] text-muted px-1">
              <span>Progress</span>
              <span className="font-semibold text-text">
                {progressPercent}%{" "}
                <span className="font-normal text-muted">
                  ({completedCount}/{outline.units.length})
                </span>
              </span>
            </div>
          )
        }
        className="shadow-2xl border-line/80 backdrop-blur-lg"
      />
    </aside>
  );
}
