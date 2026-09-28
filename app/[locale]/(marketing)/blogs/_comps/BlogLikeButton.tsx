"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleBlogLike } from "../_actions/blog-actions";

interface BlogLikeButtonProps {
  blogId: string;
  initialLikes?: number;
  isRtl?: boolean;
  className?: string;
}

const STORAGE_KEY = "medlex_liked_blogs";

// Shared client-side store for cross-component and cross-tab synchronization
const listeners = new Set<() => void>();
const blogLikesCache = new Map<string, number>();

function subscribeLikes(callback: () => void) {
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

function getStoredLikedBlogs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredLikedBlogs(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function BlogLikeButton({
  blogId,
  initialLikes = 0,
  isRtl = false,
  className,
}: BlogLikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  // Synchronize liked state from localStorage without cascading renders
  const isLiked = useSyncExternalStore(
    subscribeLikes,
    () => getStoredLikedBlogs().includes(blogId),
    () => false,
  );

  // Synchronize live likes count (optimistic cache or server initial value)
  const likesCount = useSyncExternalStore(
    subscribeLikes,
    () => {
      const cached = blogLikesCache.get(blogId);
      return typeof cached === "number" ? cached : initialLikes;
    },
    () => initialLikes,
  );

  const handleToggle = useCallback(async () => {
    if (isPending) return;

    const nextLiked = !isLiked;
    const nextCount = Math.max(0, likesCount + (nextLiked ? 1 : -1));

    // Update shared cache & localStorage
    blogLikesCache.set(blogId, nextCount);
    const stored = getStoredLikedBlogs();
    if (nextLiked) {
      if (!stored.includes(blogId)) {
        setStoredLikedBlogs([...stored, blogId]);
      }
    } else {
      setStoredLikedBlogs(stored.filter((id) => id !== blogId));
    }

    // Trigger visual pulse animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

    // Notify all instances on the page and across tabs
    notifyListeners();

    // Call Server Action
    setIsPending(true);
    try {
      const res = await toggleBlogLike(blogId, nextLiked);
      if (res && res.success && typeof res.count === "number") {
        blogLikesCache.set(blogId, res.count);
        notifyListeners();
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setIsPending(false);
    }
  }, [blogId, isLiked, likesCount, isPending]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs select-none active:scale-95 group",
        isLiked
          ? "border-rose-500/40 bg-rose-500/15 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
          : "border-white/10 bg-deep/80 text-mute hover:text-rose-400 hover:border-rose-500/30 hover:bg-deep",
        className,
      )}
      title={
        isRtl
          ? isLiked
            ? "إلغاء الإعجاب"
            : "إعجاب بالمقال"
          : isLiked
            ? "Unlike article"
            : "Like article"
      }
      aria-label={isRtl ? "إعجاب" : "Like"}
    >
      <Heart
        className={cn(
          "size-3.5 transition-transform duration-200",
          isLiked
            ? "fill-rose-500 text-rose-500"
            : "text-mute/80 group-hover:text-rose-400",
          isAnimating && "scale-125",
        )}
      />
      <span className="font-mono text-xs font-semibold tabular-nums">
        {likesCount}
      </span>
      <span className="font-sans text-[11px] hidden sm:inline">
        {isRtl ? "إعجاب" : "Likes"}
      </span>
    </button>
  );
}
