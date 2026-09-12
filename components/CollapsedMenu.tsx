"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  GripHorizontal,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CollapsedMenuItem {
  id: string | number;
  title: React.ReactNode;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export interface CollapsedMenuGroup {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  items: CollapsedMenuItem[];
}

function getSearchableTitle(title: React.ReactNode): string {
  if (typeof title === "string" || typeof title === "number") {
    return String(title);
  }

  if (Array.isArray(title)) {
    return title.map(getSearchableTitle).join(" ");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(title)) {
    return getSearchableTitle(title.props.children);
  }

  return "";
}

export interface CollapsedMenuProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  /**
   * Menu items to render (when not using groups)
   */
  items?: CollapsedMenuItem[];

  /** Optional action displayed above the menu items. */
  topAction?: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };

  /**
   * Categorized / grouped menu items
   */
  groups?: CollapsedMenuGroup[];

  /**
   * Optional URL query parameter name (e.g., "tab", "section", "campaignIndex").
   * When provided, active item selection synchronizes with the URL search query.
   */
  searchIndex?: string;

  /**
   * If true, parse search query parameter as a string.
   * If false, parse search query parameter as a number.
   * Defaults to false if defaultIndex is number, otherwise true.
   */
  isSearchString?: boolean;

  /**
   * Default active index when not specified in query params or value.
   */
  defaultIndex?: string | number;

  /**
   * Controlled active item id.
   */
  value?: string | number;

  /**
   * Default initial active item id for uncontrolled usage without searchIndex.
   */
  defaultValue?: string | number;

  /**
   * Callback fired when an item is selected.
   */
  onSelect?: (id: string | number, item: CollapsedMenuItem) => void;

  /**
   * Controlled collapsed state.
   */
  collapsed?: boolean;

  /**
   * Initial collapsed state for uncontrolled usage (defaults to false).
   */
  defaultCollapsed?: boolean;

  /**
   * Callback fired when collapsed state changes.
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Whether to show the collapse toggle button (defaults to true).
   */
  collapsible?: boolean;

  /**
   * Optional header element (e.g., title, logo).
   */
  header?: React.ReactNode;

  /**
   * Optional footer element (can be a render function receiving { isCollapsed }).
   */
  footer?:
    | React.ReactNode
    | ((state: { isCollapsed: boolean }) => React.ReactNode);

  /**
   * Visual style variant:
   * - "card": Medlex floating card with border and soft shadow
   * - "sidebar": Flat sidebar style
   * Defaults to "card".
   */
  variant?: "card" | "sidebar";

  /**
   * Custom width classes
   */
  expandedWidthClassName?: string;
  collapsedWidthClassName?: string;

  /**
   * If true, automatically collapses menu on screens < 1024px (defaults to true).
   */
  autoCollapseOnMobile?: boolean;

  /**
   * If true, allows the menu to be dragged and moved anywhere across the viewport.
   * Prevents overlapping content on small mobile devices. Defaults to true.
   */
  movable?: boolean;
}

interface CollapsedMenuItemButtonProps {
  item: CollapsedMenuItem;
  active: boolean;
  collapsed: boolean;
  groupLabel?: React.ReactNode;
  tooltipSide?: "left" | "right";
  onSelect: (item: CollapsedMenuItem) => void;
}

const CollapsedMenuItemButton = React.memo(function CollapsedMenuItemButton({
  item,
  active,
  collapsed,
  groupLabel,
  tooltipSide = "right",
  onSelect,
}: CollapsedMenuItemButtonProps) {
  const handleClick = React.useCallback(() => onSelect(item), [item, onSelect]);
  const button = (
    <button
      type="button"
      role="menuitem"
      disabled={item.disabled}
      aria-current={active ? "page" : undefined}
      aria-disabled={item.disabled}
      onClick={handleClick}
      className={cn(
        "group relative flex items-center font-body text-sm font-medium transition-all duration-200 outline-none select-none cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-signal/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
        collapsed
          ? "size-10 mx-auto justify-center rounded-xl"
          : "w-full gap-2.5 px-3 py-2 rounded-xl text-start",
        active
          ? [
              "bg-signal/15 text-signal border border-signal/30 shadow-xs",
              "after:absolute after:rounded-full after:bg-signal",
              collapsed
                ? "after:bottom-1 after:size-1"
                : "after:left-1 after:top-2 after:bottom-2 after:w-1 after:rounded-r",
            ]
          : "text-muted hover:text-text hover:bg-surface-2/70 border border-transparent",
        item.disabled && "pointer-events-none opacity-40 cursor-not-allowed",
        item.className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center transition-transform duration-200 [&_svg]:size-4.5",
          active
            ? "text-signal"
            : "text-muted group-hover:text-text group-hover:scale-105",
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <span className="truncate flex-1 font-body text-sm leading-snug tracking-wide">
          {item.title}
        </span>
      )}
      {!collapsed && item.badge && (
        <span
          className={cn(
            "ml-auto text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 transition-colors",
            active
              ? "bg-signal text-ink"
              : "bg-surface-2 text-muted group-hover:text-text",
          )}
        >
          {item.badge}
        </span>
      )}
    </button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent
        side={tooltipSide}
        sideOffset={12}
        className="flex items-center gap-2 max-w-xs"
      >
        {groupLabel && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-signal border-r border-line pr-1.5 shrink-0">
            {groupLabel}
          </span>
        )}
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <span className="rounded bg-surface px-1.5 py-0.2 text-[10px] text-signal font-semibold shrink-0">
            {item.badge}
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
});

export function CollapsedMenu({
  items,
  topAction,
  groups,
  searchIndex,
  isSearchString,
  defaultIndex,
  value,
  defaultValue,
  onSelect,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsible = true,
  header,
  footer,
  variant = "card",
  expandedWidthClassName = "w-64",
  collapsedWidthClassName = "w-[72px]",
  autoCollapseOnMobile = true,
  movable = true,
  className,
  style,
  ...props
}: CollapsedMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const menuRef = React.useRef<HTMLDivElement>(null);
  const topActionRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const hasAutoCollapsedOnMobileRef = React.useRef(false);

  // Drag / movable position state
  const [position, setPosition] = React.useState<{
    x: number;
    y: number;
    rightOffset?: number;
  } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
    topSpace: number;
    bottomSpace: number;
    actionWidth: number;
  } | null>(null);
  const dragFrameRef = React.useRef<number | null>(null);
  const dragPositionRef = React.useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = React.useRef(false);
  const lastClickTimeRef = React.useRef(0);
  const pointerCapturedRef = React.useRef(false);
  const activePointerIdRef = React.useRef<number | null>(null);
  const activeTargetRef = React.useRef<HTMLElement | null>(null);

  const handleResetPosition = React.useCallback(() => {
    if (dragFrameRef.current !== null) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }
    const actionNode = topActionRef.current;
    if (actionNode) {
      actionNode.style.left = "";
      actionNode.style.right = "";
    }
    if (menuRef.current) {
      menuRef.current.style.transform = "";
    }
    dragStartRef.current = null;
    dragPositionRef.current = null;
    hasDraggedRef.current = false;
    setIsDragging(false);
    setPosition(null);
  }, []);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!movable) return;
      if (e.pointerType === "mouse" && e.button !== 0) return; // Only primary mouse button

      const node = menuRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const actionNode = topActionRef.current;
      const actionRect = actionNode ? actionNode.getBoundingClientRect() : null;

      // Space occupied by topAction above the menu
      const topSpace = actionRect ? Math.max(0, rect.top - actionRect.top) : 0;
      const bottomSpace = actionRect
        ? Math.max(0, actionRect.bottom - rect.bottom)
        : 0;
      const actionWidth = actionRect ? actionRect.width : 0;

      dragStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: rect.left,
        initialY: rect.top,
        width: rect.width,
        height: rect.height,
        topSpace,
        bottomSpace,
        actionWidth,
      };
      dragPositionRef.current = { x: rect.left, y: rect.top };
      hasDraggedRef.current = false;
      activePointerIdRef.current = e.pointerId;
      activeTargetRef.current = e.currentTarget;
    },
    [movable],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const dragStart = dragStartRef.current;
      const node = menuRef.current;
      if (!dragStart || !node) return;

      const deltaX = e.clientX - dragStart.startX;
      const deltaY = e.clientY - dragStart.startY;
      const distance = Math.hypot(deltaX, deltaY);

      // Ignore micro-movements / trackpad subpixel jitter during a tap or click
      if (!hasDraggedRef.current) {
        if (distance < 5) return;
        hasDraggedRef.current = true;
        setIsDragging(true);
        if (activeTargetRef.current && activePointerIdRef.current !== null) {
          try {
            activeTargetRef.current.setPointerCapture(activePointerIdRef.current);
            pointerCapturedRef.current = true;
          } catch {
            // pointer capture fallback
          }
        }
      }

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const PAD = 8;

      const rawX = dragStart.initialX + deltaX;
      const rawY = dragStart.initialY + deltaY;

      const isRight = rawX > windowWidth / 2;

      // Vertical clamping: topAction above menu must not go past PAD
      const minY = PAD + dragStart.topSpace;
      // Allow moving even on compact laptop displays while ensuring the grip remains visible
      const maxY = Math.max(
        minY,
        windowHeight - PAD - Math.min(dragStart.height, 80) - dragStart.bottomSpace,
      );
      const targetY = Math.max(minY, Math.min(maxY, rawY));

      // Horizontal clamping: neither menu nor topAction may exceed screen bounds
      let minX = PAD;
      let maxX = Math.max(PAD, windowWidth - PAD - dragStart.width);

      if (isRight) {
        // Top action aligns to right edge and extends to the left
        minX = Math.max(PAD, PAD + (dragStart.actionWidth - dragStart.width));
        maxX = Math.max(minX, windowWidth - PAD - dragStart.width);
      } else {
        // Top action aligns to left edge and extends to the right
        minX = PAD;
        maxX = Math.max(
          minX,
          windowWidth - PAD - Math.max(dragStart.width, dragStart.actionWidth),
        );
      }

      const targetX = Math.max(minX, Math.min(maxX, rawX));
      dragPositionRef.current = { x: targetX, y: targetY };

      // Update action button alignment dynamically during drag
      const actionNode = topActionRef.current;
      if (actionNode) {
        if (isRight) {
          actionNode.style.left = "auto";
          actionNode.style.right = "0";
        } else {
          actionNode.style.left = "0";
          actionNode.style.right = "auto";
        }
      }

      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
      }
      dragFrameRef.current = requestAnimationFrame(() => {
        node.style.transform = `translate3d(${targetX - dragStart.initialX}px, ${targetY - dragStart.initialY}px, 0)`;
        dragFrameRef.current = null;
      });
    },
    [],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }

      if (
        pointerCapturedRef.current &&
        activeTargetRef.current &&
        activePointerIdRef.current !== null
      ) {
        try {
          activeTargetRef.current.releasePointerCapture(activePointerIdRef.current);
        } catch {
          // pointer may have already been released
        }
        pointerCapturedRef.current = false;
      }
      activePointerIdRef.current = null;
      activeTargetRef.current = null;

      const wasDragged = hasDraggedRef.current;
      hasDraggedRef.current = false;

      const finalPosition = dragPositionRef.current;
      const dragStart = dragStartRef.current;
      dragStartRef.current = null;
      dragPositionRef.current = null;

      const actionNode = topActionRef.current;
      if (actionNode) {
        actionNode.style.left = "";
        actionNode.style.right = "";
      }

      if (menuRef.current) {
        menuRef.current.style.transform = "";
      }

      setIsDragging(false);

      // If this was a click/tap without dragging, detect double-click / double-tap
      if (!wasDragged) {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 400) {
          lastClickTimeRef.current = 0;
          handleResetPosition();
          return;
        }
        lastClickTimeRef.current = now;
        return; // Do NOT commit position on a simple click/tap!
      }

      // If it WAS dragged, commit final position
      if (finalPosition) {
        const PAD = 8;
        const menuWidth =
          dragStart?.width ?? menuRef.current?.offsetWidth ?? 64;
        const rightOffset = Math.max(
          PAD,
          window.innerWidth - (finalPosition.x + menuWidth),
        );
        setPosition({
          x: finalPosition.x,
          y: finalPosition.y,
          rightOffset,
        });
      }
    },
    [handleResetPosition],
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  // Check if menu is placed on right half of viewport
  const isRightSide = React.useMemo(() => {
    if (typeof window === "undefined") return true;
    if (position) {
      return position.x > window.innerWidth / 2;
    }
    return true; // Default right-aligned
  }, [position]);

  // Collapsed internal state
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    React.useState(defaultCollapsed);
  const isCollapsed =
    controlledCollapsed !== undefined
      ? controlledCollapsed
      : uncontrolledCollapsed;

  const setCollapsed = React.useCallback(
    (nextState: boolean | ((prev: boolean) => boolean)) => {
      const resolved =
        typeof nextState === "function" ? nextState(isCollapsed) : nextState;
      if (controlledCollapsed === undefined) {
        setUncontrolledCollapsed(resolved);
      }
      onCollapsedChange?.(resolved);
    },
    [controlledCollapsed, isCollapsed, onCollapsedChange],
  );

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev);
  }, [setCollapsed]);

  // Style with smart anchoring based on viewport side so it expands INTO the screen
  const computedStyle = React.useMemo(() => {
    if (!position) return style;

    const windowWidth =
      typeof window !== "undefined" ? window.innerWidth : 1200;
    const windowHeight =
      typeof window !== "undefined" ? window.innerHeight : 800;

    const PAD = 8;
    // Constrain menu height to available space below position.y so it never goes off bottom
    const maxMenuHeight = Math.max(160, windowHeight - position.y - PAD);

    if (isRightSide) {
      // Pin right edge so when it expands or opens, it expands TO THE LEFT into the viewport
      const rightDistance = Math.max(
        PAD,
        position.rightOffset ?? (windowWidth - position.x - 64),
      );
      return {
        ...style,
        position: "fixed" as const,
        right: `${rightDistance}px`,
        left: "auto",
        top: `${position.y}px`,
        bottom: "auto",
        maxHeight: `${maxMenuHeight}px`,
        transform: "none",
        margin: 0,
        zIndex: 9999,
      };
    }

    // Pin left edge so when it expands, it expands TO THE RIGHT into the viewport
    return {
      ...style,
      position: "fixed" as const,
      left: `${Math.max(PAD, position.x)}px`,
      right: "auto",
      top: `${position.y}px`,
      bottom: "auto",
      maxHeight: `${maxMenuHeight}px`,
      transform: "none",
      margin: 0,
      zIndex: 9999,
    };
  }, [position, isRightSide, style]);

  // Re-clamp position within viewport on resize or collapsed toggle
  React.useEffect(() => {
    if (!position) return;
    const clampToViewport = () => {
      const node = menuRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const actionNode = topActionRef.current;
      const actionRect = actionNode ? actionNode.getBoundingClientRect() : null;

      const PAD = 8;
      const topSpace = actionRect ? Math.max(0, rect.top - actionRect.top) : 0;
      const bottomSpace = actionRect
        ? Math.max(0, actionRect.bottom - rect.bottom)
        : 0;
      const actionWidth = actionRect ? actionRect.width : 0;

      const minY = PAD + topSpace;
      const maxY = Math.max(
        minY,
        window.innerHeight - PAD - Math.min(rect.height, 80) - bottomSpace,
      );

      setPosition((prev) => {
        if (!prev) return null;
        const isRight = prev.x > window.innerWidth / 2;

        let minX = PAD;
        let maxX = Math.max(PAD, window.innerWidth - PAD - rect.width);
        if (isRight) {
          minX = Math.max(PAD, PAD + (actionWidth - rect.width));
          maxX = Math.max(minX, window.innerWidth - PAD - rect.width);
        } else {
          minX = PAD;
          maxX = Math.max(
            minX,
            window.innerWidth - PAD - Math.max(rect.width, actionWidth),
          );
        }

        const clampedX = Math.max(minX, Math.min(maxX, prev.x));
        const clampedY = Math.max(minY, Math.min(maxY, prev.y));
        const rightOffset = Math.max(
          PAD,
          window.innerWidth - (clampedX + rect.width),
        );

        if (
          clampedX !== prev.x ||
          clampedY !== prev.y ||
          rightOffset !== prev.rightOffset
        ) {
          return {
            x: clampedX,
            y: clampedY,
            rightOffset,
          };
        }
        return prev;
      });
    };

    const rafId = requestAnimationFrame(clampToViewport);
    window.addEventListener("resize", clampToViewport);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", clampToViewport);
    };
  }, [position, isCollapsed]);

  // Responsive auto-collapse for tablets / mobile
  React.useEffect(() => {
    return () => {
      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!autoCollapseOnMobile) return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleMedia = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && !hasAutoCollapsedOnMobileRef.current) {
        hasAutoCollapsedOnMobileRef.current = true;
        setCollapsed(true);
        return;
      }
      if (!e.matches) {
        hasAutoCollapsedOnMobileRef.current = false;
      }
    };
    handleMedia(mediaQuery);
    mediaQuery.addEventListener("change", handleMedia);
    return () => mediaQuery.removeEventListener("change", handleMedia);
  }, [autoCollapseOnMobile, setCollapsed]);

  // Flattened items for lookup
  const allItems = React.useMemo(() => {
    if (groups && groups.length > 0) {
      return groups.flatMap((g) => g.items);
    }
    return items ?? [];
  }, [items, groups]);

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredGroups = React.useMemo(
    () =>
      groups
        ?.map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            getSearchableTitle(item.title)
              .toLocaleLowerCase()
              .includes(normalizedSearchQuery),
          ),
        }))
        .filter((group) => group.items.length > 0) ?? [],
    [groups, normalizedSearchQuery],
  );
  const filteredItems = React.useMemo(
    () =>
      allItems.filter((item) =>
        getSearchableTitle(item.title)
          .toLocaleLowerCase()
          .includes(normalizedSearchQuery),
      ),
    [allItems, normalizedSearchQuery],
  );
  const hasSearchResults = groups?.length
    ? filteredGroups.length > 0
    : filteredItems.length > 0;

  // Determine active item id
  const effectiveIsSearchString =
    isSearchString !== undefined
      ? isSearchString
      : typeof defaultIndex === "string";

  const searchParamValue = searchIndex ? searchParams?.get(searchIndex) : null;

  const initialActive =
    defaultValue ??
    defaultIndex ??
    (allItems[0]?.id as string | number | undefined);
  const [uncontrolledActiveId, setUncontrolledActiveId] = React.useState<
    string | number | undefined
  >(initialActive);

  const activeId = React.useMemo(() => {
    if (value !== undefined) {
      return value;
    }
    if (searchIndex) {
      if (searchParamValue !== null && searchParamValue !== undefined) {
        return effectiveIsSearchString
          ? searchParamValue
          : Number(searchParamValue);
      }
      return defaultIndex ?? allItems[0]?.id;
    }
    return uncontrolledActiveId;
  }, [
    value,
    searchIndex,
    searchParamValue,
    effectiveIsSearchString,
    defaultIndex,
    allItems,
    uncontrolledActiveId,
  ]);

  // Group collapsed / expanded accordion state
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => {
      const initial = new Set<string>();
      if (groups) {
        groups.forEach((g) => {
          const hasActive = g.items.some(
            (item) => String(item.id) === String(initialActive),
          );
          if (g.defaultExpanded ?? hasActive) {
            initial.add(g.key);
          }
        });
      }
      return initial;
    },
  );

  const toggleGroup = React.useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }, []);

  const handleItemClick = React.useCallback(
    (item: CollapsedMenuItem) => {
      if (item.disabled) return;

      item.onClick?.();
      onSelect?.(item.id, item);

      if (value === undefined && !searchIndex) {
        setUncontrolledActiveId(item.id);
      }

      if (item.href) {
        router.push(item.href);
        return;
      }

      if (searchIndex && searchParams) {
        const currentVal = searchParams.get(searchIndex);
        const nextVal = String(item.id);
        if (currentVal !== nextVal) {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set(searchIndex, nextVal);
          router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
      }
    },
    [onSelect, value, searchIndex, searchParams, pathname, router],
  );

  const renderItem = React.useCallback(
    (item: CollapsedMenuItem, groupLabel?: React.ReactNode) => (
      <CollapsedMenuItemButton
        key={item.id}
        item={item}
        active={String(activeId) === String(item.id)}
        collapsed={isCollapsed}
        groupLabel={groupLabel}
        tooltipSide={isRightSide ? "left" : "right"}
        onSelect={handleItemClick}
      />
    ),
    [activeId, handleItemClick, isCollapsed, isRightSide],
  );

  return (
    <TooltipProvider delay={100}>
      <div
        ref={menuRef}
        data-slot="collapsed-menu"
        data-collapsed={isCollapsed}
        data-dragging={isDragging}
        style={computedStyle}
        className={cn(
          "relative sticky top-16 h-fit max-h-[calc(100dvh-5rem)] flex flex-col transition-[width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isDragging &&
            "!transition-none !backdrop-blur-none select-none shadow-2xl ring-2 ring-signal/40",
          isCollapsed ? collapsedWidthClassName : expandedWidthClassName,
          !isCollapsed &&
            "max-lg:fixed max-lg:top-24 max-lg:bottom-4 max-lg:end-2 max-lg:z-50 max-lg:!h-[calc(100dvh-7rem)] max-lg:w-[min(18rem,calc(100vw-1rem))] max-lg:max-w-[calc(100vw-1rem)] max-lg:overflow-hidden",
          variant === "card" && [
            "rounded-2xl border border-line bg-surface/95 backdrop-blur-md p-2.5",
            "shadow-xl shadow-ink/30 ring-1 ring-white/5",
          ],
          variant === "sidebar" && [
            "h-full border-r border-line bg-surface p-3",
          ],
          className,
        )}
        {...props}
      >
        {topAction && (
          <div
            ref={topActionRef}
            data-mobile-workbook
            className={cn(
              "absolute bottom-full mb-3 z-10 pointer-events-auto max-w-[calc(100vw-1rem)]",
              isRightSide ? "right-0 left-auto" : "left-0 right-auto",
            )}
          >
            <Tooltip>
              <TooltipTrigger
                render={(triggerProps) => (
                  <a
                    {...triggerProps}
                    href={topAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={topAction.label}
                    className={cn(
                      "flex min-h-11 items-center rounded-2xl border border-amber-300/40 bg-amber-950/80 px-3 text-amber-200 shadow-lg shadow-black/25 backdrop-blur-md transition-colors hover:border-amber-200/70 hover:bg-amber-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60",
                      "h-11 w-max max-w-[calc(100vw-2rem)] justify-start gap-2 px-3",
                      "max-md:!size-10 max-md:!min-h-10 max-md:!w-10 max-md:!justify-center max-md:!gap-0 max-md:!px-0",
                    )}
                  >
                    <span className="shrink-0 [&_svg]:size-4.5">
                      {topAction.icon}
                    </span>
                    <span className="whitespace-nowrap truncate text-sm font-semibold max-md:!hidden">
                      {topAction.label}
                    </span>
                  </a>
                )}
              />
              <TooltipContent
                side={isRightSide ? "left" : "right"}
                sideOffset={10}
              >
                {topAction.label}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {movable && isCollapsed && (
          <Tooltip>
            <TooltipTrigger
              type="button"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleResetPosition}
              aria-label="Drag to move menu"
              className="flex w-full items-center justify-center py-1 -mt-0.5 mb-1 rounded-md border border-transparent select-none text-muted/40 transition-colors hover:text-signal hover:bg-surface-2/60 cursor-grab active:cursor-grabbing touch-none"
            >
              <GripHorizontal className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent
              side={isRightSide ? "left" : "right"}
              sideOffset={12}
            >
              Drag to move (double-click to reset)
            </TooltipContent>
          </Tooltip>
        )}

        {(collapsible || header || allItems.length > 0) && (
          <div
            onDoubleClick={handleResetPosition}
            className={cn(
              "flex items-center pb-2.5 mb-2 border-b border-line/60 transition-all duration-200",
              isCollapsed
                ? "justify-center"
                : header
                  ? "justify-between px-1"
                  : "justify-end px-1",
            )}
          >
            {!isCollapsed && header && (
              <div className="truncate font-heading text-sm font-semibold text-text">
                {header}
              </div>
            )}
            <div className="flex items-center gap-1 shrink-0">
              {movable && !isCollapsed && (
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onDoubleClick={handleResetPosition}
                    aria-label="Drag to move menu"
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-transparent select-none text-muted/50 transition-colors hover:border-line hover:bg-surface-2 hover:text-signal cursor-grab active:cursor-grabbing touch-none"
                  >
                    <GripVertical className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8}>
                    Drag to move (double-click to reset)
                  </TooltipContent>
                </Tooltip>
              )}
              {collapsible && (
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label={
                      isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted transition-all duration-200 hover:border-line hover:bg-surface-2 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40 cursor-pointer active:scale-95"
                  >
                    {isCollapsed ? (
                      <PanelLeftOpen className="size-4.5" />
                    ) : (
                      <PanelLeftClose className="size-4.5" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    side={isRightSide ? "left" : "right"}
                    sideOffset={10}
                  >
                    {isCollapsed ? "Expand menu" : "Collapse menu"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="relative mb-2">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search lessons"
              aria-label="Search lessons by name"
              className={cn(
                "h-10 w-full rounded-xl border border-line bg-surface-2/50 ps-9 pe-9 font-body text-sm text-text outline-none",
                "placeholder:text-muted focus:border-signal/50 focus:ring-2 focus:ring-signal/25",
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear lesson search"
                className="absolute end-1.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Menu Items List */}
        <nav
          className="min-h-0 w-full flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden max-h-[min(80vh,680px)] max-lg:!max-h-none pr-0.5"
          role="menu"
          aria-orientation="vertical"
        >
          {!hasSearchResults ? (
            <p
              className="px-3 py-4 text-center font-body text-sm text-muted"
              role="status"
            >
              No lessons found.
            </p>
          ) : groups && groups.length > 0 ? (
            filteredGroups.map((group, gIdx) => {
              const isGroupExpanded =
                normalizedSearchQuery.length > 0 ||
                expandedGroups.has(group.key);
              if (isCollapsed) {
                const hasActive = group.items.some(
                  (item) => String(item.id) === String(activeId),
                );

                return (
                  <div key={group.key} className="flex flex-col gap-1">
                    {gIdx > 0 && (
                      <div
                        className="h-px bg-line/40 my-1 mx-1.5"
                        aria-hidden="true"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedGroups((previous) => {
                          const next = new Set(previous);
                          next.add(group.key);
                          return next;
                        });
                        setCollapsed(false);
                      }}
                      aria-label="Open category"
                      className={cn(
                        "size-10 mx-auto flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer outline-none",
                        "focus-visible:ring-2 focus-visible:ring-signal/40",
                        hasActive
                          ? "bg-surface-2 text-signal border border-line shadow-xs"
                          : "text-muted hover:text-text hover:bg-surface-2/60 border border-transparent",
                      )}
                    >
                      <span className="relative flex items-center justify-center [&_svg]:size-4.5">
                        {group.icon}
                        <span
                          className={cn(
                            "absolute -bottom-1 -right-1 size-1.5 rounded-full",
                            hasActive ? "bg-signal" : "bg-muted/40",
                          )}
                        />
                      </span>
                    </button>
                  </div>
                );
              }

              return (
                <div key={group.key} className="flex flex-col gap-1">
                  {gIdx > 0 && <div className="h-px bg-line/40 my-1 mx-1" />}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    aria-expanded={isGroupExpanded}
                    className={cn(
                      "flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-start transition-colors cursor-pointer",
                      "text-[11px] font-semibold tracking-wider uppercase text-muted hover:text-text hover:bg-surface-2/60",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal/40",
                    )}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {group.icon && (
                        <span className="shrink-0 text-muted">
                          {group.icon}
                        </span>
                      )}
                      <span className="truncate">{group.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-2 border border-line text-muted font-normal">
                        {group.badge ?? group.items.length}
                      </span>
                    </span>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "shrink-0 text-muted transition-transform duration-200",
                        isGroupExpanded && "rotate-180 text-signal",
                      )}
                    />
                  </button>

                  {isGroupExpanded && (
                    <div className="flex flex-col gap-1 pl-1">
                      {group.items.map((item) => renderItem(item))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            filteredItems.map((item) => renderItem(item))
          )}
        </nav>

        {/* Optional Footer */}
        {footer && (
          <div
            className={cn(
              "mt-auto pt-2.5 border-t border-line/60 transition-all duration-200",
              isCollapsed ? "flex justify-center" : "px-1",
            )}
          >
            {typeof footer === "function" ? footer({ isCollapsed }) : footer}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

export default CollapsedMenu;
