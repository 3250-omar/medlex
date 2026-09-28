"use client";

import React, { useState, useCallback } from "react";
import { Share2 } from "lucide-react";
import { ShareDialog } from "./ShareDialog";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  blogId?: string;
  title: string;
  initialShares?: number;
  isRtl: boolean;
  className?: string;
}

export function ShareButtons({
  blogId,
  title,
  initialShares = 0,
  isRtl,
  className,
}: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sharesCount, setSharesCount] = useState<number>(initialShares);

  const handleShareTracked = useCallback((newCount: number) => {
    setSharesCount(newCount);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-deep/80 text-xs font-medium text-mute hover:text-gold hover:border-gold/40 hover:bg-deep transition-all duration-200 cursor-pointer shadow-xs select-none active:scale-95 group",
          className
        )}
        title={isRtl ? "مشاركة المقال" : "Share Article"}
        aria-label={isRtl ? "مشاركة" : "Share"}
      >
        <Share2 className="size-3.5 text-gold/80 group-hover:text-gold group-hover:scale-110 transition-all duration-200" />
        <span className="font-mono text-xs font-semibold tabular-nums text-lbody">
          {sharesCount}
        </span>
        <span className="font-sans text-[11px] hidden sm:inline text-mute">
          {isRtl ? "مشاركة" : "Shares"}
        </span>
      </button>

      <ShareDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        blogId={blogId}
        isRtl={isRtl}
        onShareTracked={handleShareTracked}
      />
    </div>
  );
}
