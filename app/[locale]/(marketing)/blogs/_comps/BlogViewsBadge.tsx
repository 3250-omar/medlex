"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { incrementBlogViews } from "../_actions/blog-actions";

interface BlogViewsBadgeProps {
  blogId: string;
  initialViews?: number;
  isRtl?: boolean;
  className?: string;
  showLabel?: boolean;
}

const STORAGE_KEY = "medlex_viewed_blogs";

// Shared client-side store for cross-component and cross-tab synchronization
const listeners = new Set<() => void>();
const blogViewsCache = new Map<string, number>();
const viewedInSession = new Set<string>();

function subscribeViews(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
}

function getStoredViewedBlogs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function hasViewed(blogId: string): boolean {
  if (typeof window === "undefined") return false;
  if (viewedInSession.has(blogId)) return true;
  const list = getStoredViewedBlogs();
  return list.includes(blogId);
}

function recordView(blogId: string): void {
  if (typeof window === "undefined") return;
  viewedInSession.add(blogId);
  try {
    const list = getStoredViewedBlogs();
    if (!list.includes(blogId)) {
      list.push(blogId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

export function BlogViewsBadge({
  blogId,
  initialViews = 0,
  isRtl = false,
  className,
  showLabel = true,
}: BlogViewsBadgeProps) {
  // Synchronize live views count (cached or server initial value)
  const viewsCount = useSyncExternalStore(
    subscribeViews,
    () => {
      const cached = blogViewsCache.get(blogId);
      return typeof cached === "number" ? cached : initialViews;
    },
    () => initialViews,
  );

  useEffect(() => {
    if (!blogId) return;

    // Check if user already viewed this blog post
    if (hasViewed(blogId)) {
      return;
    }

    // Mark as viewed in localStorage and session memory immediately
    recordView(blogId);

    // Optimistically update live count
    const current = blogViewsCache.get(blogId) ?? initialViews;
    const next = current + 1;
    blogViewsCache.set(blogId, next);
    notifyListeners();

    // Call Server Action to increment count in database
    incrementBlogViews(blogId)
      .then((res) => {
        if (res && res.success && typeof res.count === "number") {
          blogViewsCache.set(blogId, res.count);
          notifyListeners();
        }
      })
      .catch((err) => {
        console.error("Failed to increment blog views:", err);
      });
  }, [blogId, initialViews]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-deep/80 text-xs font-medium text-mute cursor-default select-none shadow-xs",
        className,
      )}
      title={isRtl ? "عدد المشاهدات" : "Views count"}
      aria-label={isRtl ? "المشاهدات" : "Views"}
    >
      <Eye className="size-3.5 text-gold/80" />
      <span className="font-mono text-xs font-semibold tabular-nums text-lbody">
        {viewsCount}
      </span>
      {showLabel && (
        <span className="font-sans text-[11px] hidden sm:inline text-mute">
          {isRtl ? "مشاهدة" : "Views"}
        </span>
      )}
    </div>
  );
}
