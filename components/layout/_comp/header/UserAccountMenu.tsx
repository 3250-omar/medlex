"use client";

import { memo } from "react";
import Link from "next/link";
import type { CurrentUser } from "@/app/[locale]/(marketing)/_apiCalls/academyQueries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UserAccountMenuProps {
  user: CurrentUser;
  locale: string;
  onSignOut: () => void;
  profileLabel: string;
  logoutLabel: string;
}

export const UserAccountMenu = memo(function UserAccountMenu({
  user,
  locale,
  onSignOut,
  profileLabel,
  logoutLabel,
}: UserAccountMenuProps) {
  const userName = user.fullName ?? user.email ?? "User";
  const initials = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`${userName} - open account menu`}
            className="flex size-9 items-center justify-center rounded-full bg-signal font-body text-sm font-semibold text-ink transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </button>
        }
      />

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="min-w-[180px] rounded-none border border-white/10 bg-ink p-1 text-sm text-white shadow-xl"
      >
        {/* User info */}
        <div className="px-3 py-2">
          <p className="truncate font-body text-xs font-semibold text-white">
            {userName}
          </p>
          <p className="truncate font-body text-[11px] text-white/45">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="cursor-pointer rounded-none px-3 py-2 font-body text-sm text-white/75 hover:bg-white/6 hover:text-white focus:bg-white/8 focus:text-white"
          render={
            <Link
              href={`/${locale}/profile`}
              className="flex w-full items-center gap-2"
            >
              {profileLabel}
            </Link>
          }
        />

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={onSignOut}
          className="cursor-pointer rounded-none px-3 py-2 font-body text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
        >
          {logoutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default UserAccountMenu;
