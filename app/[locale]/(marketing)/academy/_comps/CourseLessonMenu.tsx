"use client";

import Link from "next/link";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ListTree,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { CourseOutline } from "../_apiCalls/learningQueries";

type CourseLessonMenuProps = {
  courseSlug: string;
  currentUnitSlug: string;
  locale: string;
  outline: CourseOutline;
};

type LessonCategory = "domains" | "stations" | "other";

type LessonGroup = {
  key: LessonCategory;
  label: string;
  lessons: CourseOutline["units"];
};

function isCompleted(status: string | null, progressPercent: number) {
  return status === "completed" || progressPercent >= 100;
}

function getCategory(slug: string): LessonCategory {
  if (slug.startsWith("domain")) return "domains";
  if (slug.startsWith("station")) return "stations";
  return "other";
}

function groupLessons(units: CourseOutline["units"]): LessonGroup[] {
  const groups: Record<LessonCategory, LessonGroup> = {
    domains: { key: "domains", label: "Domains", lessons: [] },
    stations: { key: "stations", label: "Stations", lessons: [] },
    other: { key: "other", label: "Other lessons", lessons: [] },
  };

  for (const unit of units) groups[getCategory(unit.slug)].lessons.push(unit);

  return [groups.domains, groups.stations, groups.other].filter(
    (group) => group.lessons.length > 0,
  );
}

export default function CourseLessonMenu({
  courseSlug,
  currentUnitSlug,
  locale,
  outline,
}: CourseLessonMenuProps) {
  const [expandedGroups, setExpandedGroups] = useState<LessonCategory[]>([]);
  const firstIncompleteIndex = outline.units.findIndex(
    (unit) => !isCompleted(unit.status, unit.progressPercent),
  );
  const unlockedThroughIndex =
    firstIncompleteIndex === -1
      ? outline.units.length - 1
      : firstIncompleteIndex;
  const lessonIndexBySlug = new Map(
    outline.units.map((unit, index) => [unit.slug, index]),
  );
  const lessonGroups = groupLessons(outline.units);

  function toggleGroup(group: LessonCategory) {
    setExpandedGroups((openGroups) =>
      openGroups.includes(group)
        ? openGroups.filter((openGroup) => openGroup !== group)
        : [...openGroups, group],
    );
  }

  return (
    <div className="casc-lesson-menu">
      <Popover>
        <PopoverTrigger
          className="casc-lesson-menu-trigger"
          aria-label="Open course lesson menu"
        >
          <ListTree aria-hidden="true" size={18} />
          <span>Lessons</span>
        </PopoverTrigger>

        <PopoverContent
          side="left"
          align="center"
          sideOffset={12}
          positionerClassName="!z-[9999]"
          className="casc-lesson-menu-popover"
        >
          <PopoverHeader className="casc-lesson-menu-heading">
            <p>Course map</p>
            <PopoverTitle>{outline.course.title}</PopoverTitle>
          </PopoverHeader>

          <nav aria-label="All course lessons">
            {lessonGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.key);
              const groupId = `course-lessons-${group.key}`;

              return (
                <section className="casc-lesson-menu-group" key={group.key}>
                  <button
                    type="button"
                    className="casc-lesson-menu-group-toggle"
                    aria-expanded={isExpanded}
                    aria-controls={groupId}
                    onClick={() => toggleGroup(group.key)}
                  >
                    <span>
                      {group.label}
                      <small>{group.lessons.length}</small>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      size={18}
                      className={isExpanded ? "is-expanded" : undefined}
                    />
                  </button>

                  {isExpanded ? (
                    <ol id={groupId}>
                      {group.lessons.map((lesson) => {
                        const lessonIndex =
                          lessonIndexBySlug.get(lesson.slug) ?? -1;
                        const completed = isCompleted(
                          lesson.status,
                          lesson.progressPercent,
                        );
                        const unlocked = lessonIndex <= unlockedThroughIndex;
                        const current = lesson.slug === currentUnitSlug;
                        const lessonNumber = lessonIndex + 1;
                        const lessonContent = (
                          <>
                            <span
                              className="casc-lesson-menu-marker"
                              aria-hidden="true"
                            >
                              {completed ? <Check size={14} /> : lessonNumber}
                            </span>
                            <span className="casc-lesson-menu-copy">
                              <span>{lesson.title}</span>
                              <small>
                                {completed
                                  ? "Completed"
                                  : current
                                    ? "Current lesson"
                                    : unlocked
                                      ? "Available"
                                      : "Complete the previous lesson to unlock"}
                              </small>
                            </span>
                            {unlocked ? (
                              <ChevronRight aria-hidden="true" size={16} />
                            ) : (
                              <LockKeyhole aria-hidden="true" size={15} />
                            )}
                          </>
                        );

                        return (
                          <li key={lesson.id}>
                            {unlocked ? (
                              <Link
                                href={`/${locale}/academy/courses/${courseSlug}/learn/${lesson.slug}`}
                                className={current ? "is-current" : undefined}
                                aria-current={current ? "page" : undefined}
                              >
                                {lessonContent}
                              </Link>
                            ) : (
                              <button
                                type="button"
                                disabled
                                aria-label={`${lesson.title}: complete the previous lesson to unlock`}
                              >
                                {lessonContent}
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  ) : null}
                </section>
              );
            })}
          </nav>
        </PopoverContent>
      </Popover>
    </div>
  );
}
