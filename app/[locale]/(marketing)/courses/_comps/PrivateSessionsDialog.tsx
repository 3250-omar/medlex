"use client";

import { useLocale, useTranslations } from "next-intl";
import { Calendar, Clock, ExternalLink, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { UserUpcomingBooking } from "../../_apiCalls/academyQueries";

export interface PrivateSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle?: string;
  sessions: UserUpcomingBooking[];
}

export default function PrivateSessionsDialog({
  open,
  onOpenChange,
  courseTitle,
  sessions,
}: PrivateSessionsDialogProps) {
  const locale = useLocale();
  const t = useTranslations("enrolledCourses.dialog");

  if (!open && sessions.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-white/15 bg-navy/95 p-6 text-white backdrop-blur-xl sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Video className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-serif text-xl text-white">
                {courseTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-mute mt-0.5">
                {t("subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
          {sessions.map((session, idx) => {
            const link = session.joinUrl || session.sessionLink;
            const dateStr = session.startsAt
              ? new Date(session.startsAt).toLocaleDateString(
                  locale === "ar" ? "ar-EG" : "en-US",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )
              : "";
            const timeStr = session.startsAt
              ? new Date(session.startsAt).toLocaleTimeString(
                  locale === "ar" ? "ar-EG" : "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )
              : "";

            return (
              <div
                key={session.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-emerald-500/30"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold">
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-white">
                      {dateStr}
                    </p>
                    <div className="mt-1 flex items-center gap-2 font-body text-xs text-mute">
                      <Clock className="size-3 text-white/50" />
                      <span>{timeStr}</span>
                      <span className="text-white/20">•</span>
                      <span className="capitalize text-emerald-400">
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 px-4 py-2 font-body text-xs font-semibold text-navy transition-all duration-200 shadow-md hover:shadow-emerald-500/25"
                    >
                      <Video className="size-3.5" />
                      <span>{t("joinSession")}</span>
                      <ExternalLink className="size-3 opacity-70" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-body text-xs text-mute">
                      {t("linkPending")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="mt-4 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-full border border-white/20 px-5 py-2 font-body text-xs font-medium text-white transition-colors hover:bg-white/10 cursor-pointer"
          >
            {t("close")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
