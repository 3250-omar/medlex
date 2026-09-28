"use client";

import {
  useEffect,
  useState,
  useTransition,
  useSyncExternalStore,
  useCallback,
  useMemo,
} from "react";
import { toggleBlogLike, incrementBlogViews } from "../_actions/blog-actions";
import { ShareDialog } from "./ShareDialog";

interface ArticleActionRailProps {
  blogId: string;
  articleTitle?: string;
  initialLikes?: number;
  initialShares?: number;
  initialViews?: number;
  isRtl?: boolean;
}

const LIKES_KEY = "medlex_liked_blogs";
const VIEWS_SESSION_KEY = "medlex_viewed_session_blogs";

// Shared event listeners for storage sync
const likeListeners = new Set<() => void>();
const viewsListeners = new Set<() => void>();
const blogViewsCache = new Map<string, number>();

function subscribeLikes(callback: () => void) {
  likeListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    likeListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function notifyLikes() {
  likeListeners.forEach((l) => {
    try {
      l();
    } catch {}
  });
}

function subscribeViews(callback: () => void) {
  viewsListeners.add(callback);
  return () => {
    viewsListeners.delete(callback);
  };
}

function notifyViews() {
  viewsListeners.forEach((l) => {
    try {
      l();
    } catch {}
  });
}

function isBlogLiked(blogId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(blogId);
  } catch {
    return false;
  }
}

function setStoredLike(blogId: string, liked: boolean): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    let list: string[] = raw ? JSON.parse(raw) : [];
    if (liked) {
      if (!list.includes(blogId)) list.push(blogId);
    } else {
      list = list.filter((id) => id !== blogId);
    }
    localStorage.setItem(LIKES_KEY, JSON.stringify(list));
    notifyLikes();
  } catch {}
}

const viewedSessionCache = new Set<string>();

function hasViewedInSession(blogId: string): boolean {
  if (typeof window === "undefined") return false;
  if (viewedSessionCache.has(blogId)) return true;
  try {
    const raw = sessionStorage.getItem(VIEWS_SESSION_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(blogId);
  } catch {
    return false;
  }
}

function markViewedInSession(blogId: string): void {
  if (typeof window === "undefined") return;
  viewedSessionCache.add(blogId);
  try {
    const raw = sessionStorage.getItem(VIEWS_SESSION_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(blogId)) {
      list.push(blogId);
      sessionStorage.setItem(VIEWS_SESSION_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function ArticleActionRail({
  blogId,
  articleTitle,
  initialLikes = 0,
  initialShares = 0,
  initialViews = 0,
  isRtl = false,
}: ArticleActionRailProps) {
  // 1. Sync liked state from browser storage without synchronous setState in effect
  const hasLiked = useSyncExternalStore(
    subscribeLikes,
    () => isBlogLiked(blogId),
    () => false,
  );

  // 2. Sync views count via external cache
  const views = useSyncExternalStore(
    subscribeViews,
    () => {
      const cached = blogViewsCache.get(blogId);
      return typeof cached === "number" ? cached : initialViews;
    },
    () => initialViews,
  );

  const [likesOffset, setLikesOffset] = useState(0);
  const [shares, setShares] = useState(initialShares);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [, startTransition] = useTransition();

  const totalLikes = useMemo(
    () => Math.max(0, initialLikes + likesOffset),
    [initialLikes, likesOffset],
  );

  // View counter increment without calling setState synchronously in effect
  useEffect(() => {
    if (!blogId || hasViewedInSession(blogId)) return;

    markViewedInSession(blogId);

    // Optimistically update views cache & notify subscribers outside of synchronous render phase
    const timer = setTimeout(() => {
      const current = blogViewsCache.get(blogId) ?? initialViews;
      blogViewsCache.set(blogId, current + 1);
      notifyViews();
    }, 0);

    // Persist to server
    void incrementBlogViews(blogId).then((res) => {
      if (res && res.success && typeof res.count === "number") {
        blogViewsCache.set(blogId, res.count);
        notifyViews();
      }
    });

    return () => clearTimeout(timer);
  }, [blogId, initialViews]);

  const handleLike = useCallback(() => {
    const nextLiked = !hasLiked;
    setStoredLike(blogId, nextLiked);
    setLikesOffset((prev) => prev + (nextLiked ? 1 : -1));

    startTransition(async () => {
      const res = await toggleBlogLike(blogId, nextLiked);
      if (res && res.success && typeof res.count === "number") {
        setLikesOffset(res.count - initialLikes);
      }
    });
  }, [hasLiked, blogId, initialLikes]);

  const handleShare = useCallback(() => {
    setShareDialogOpen(true);
  }, []);

  const handleShareTracked = useCallback((newCount: number) => {
    setShares(newCount);
  }, []);

  const likeLabel = useMemo(() => (isRtl ? "إعجاب" : "Like"), [isRtl]);
  const shareLabel = useMemo(
    () => (isRtl ? "مشاركة المقال" : "Share article"),
    [isRtl],
  );
  const viewsUnit = useMemo(() => (isRtl ? "مشاهدة" : "views"), [isRtl]);

  return (
    <>
      {/* Desktop Vertical Rail (sticky on desktop) */}
      <aside
        aria-label="Article actions"
        className="hidden md:flex sticky top-24 self-start flex-col items-center gap-2.5 z-20"
      >
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={hasLiked}
          aria-label={likeLabel}
          className={`w-[52px] h-[52px] rounded-[14px] border transition-all flex flex-col items-center justify-center gap-0.5 text-xs cursor-pointer ${
            hasLiked
              ? "bg-[#d63c5a]/20 border-[#e0567a] text-[#ff8fa9]"
              : "bg-[#17305a] border-[#d6b03f]/25 text-[#a9b6cb] hover:border-[#d6b03f] hover:text-[#f3efe4]"
          }`}
        >
          <svg
            className={`w-[18px] h-[18px] transition-transform active:scale-125 ${
              hasLiked ? "fill-current" : "fill-none stroke-current"
            }`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
          <span className="font-semibold text-[11px] leading-tight">
            {totalLikes}
          </span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label={shareLabel}
          className="w-[52px] h-[52px] rounded-[14px] border border-[#d6b03f]/25 bg-[#17305a] hover:border-[#d6b03f] text-[#a9b6cb] hover:text-[#f3efe4] transition-all flex flex-col items-center justify-center gap-0.5 text-xs cursor-pointer"
        >
          <svg
            className="w-[18px] h-[18px] fill-none stroke-current"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8.3 10.9l7.4-3.8M8.3 13.1l7.4 3.8" />
          </svg>
          <span className="font-semibold text-[11px] leading-tight">
            {shares}
          </span>
        </button>

        {/* Views Count */}
        <div className="w-[52px] text-center pt-1.5 text-xs text-[#a9b6cb]">
          <b className="block text-[15px] font-bold text-[#f3efe4] leading-tight">
            {views}
          </b>
          <span className="text-[11px] text-[#a9b6cb]">{viewsUnit}</span>
        </div>
      </aside>

      {/* Mobile Floating Bottom Bar (visible < md) */}
      <aside
        aria-label="Article mobile actions"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex md:hidden items-center gap-2 bg-[#0b1a30]/95 border border-[#d6b03f]/30 rounded-full px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
      >
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={hasLiked}
          className={`h-10 px-3 rounded-full flex items-center gap-1.5 text-xs font-semibold cursor-pointer border ${
            hasLiked
              ? "bg-[#d63c5a]/20 border-[#e0567a] text-[#ff8fa9]"
              : "bg-[#17305a] border-white/10 text-[#a9b6cb]"
          }`}
        >
          <svg
            className={`w-4 h-4 ${hasLiked ? "fill-current" : "fill-none stroke-current"}`}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
          <span>{totalLikes}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="h-10 px-3 rounded-full flex items-center gap-1.5 text-xs font-semibold bg-[#17305a] border border-white/10 text-[#a9b6cb] cursor-pointer"
        >
          <svg
            className="w-4 h-4 fill-none stroke-current"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8.3 10.9l7.4-3.8M8.3 13.1l7.4 3.8" />
          </svg>
          <span>{shares}</span>
        </button>

        <div className="px-2 text-center text-xs text-[#a9b6cb]">
          <span className="font-bold text-[#f3efe4] me-1">{views}</span>
          <span className="text-[11px]">{viewsUnit}</span>
        </div>
      </aside>

      {/* Share Dialog Modal */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        title={articleTitle || (isRtl ? "مقال ميدلكس" : "MedLex Article")}
        blogId={blogId}
        isRtl={isRtl}
        onShareTracked={handleShareTracked}
      />
    </>
  );
}
