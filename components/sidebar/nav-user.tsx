"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/useAuth";
import { DEFAULT_PROFILE_IMAGE } from "@/constant";
import { useSignout } from "@/hooks/use-signout";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/hooks/use-role-redirect";
import { IconUser } from "@tabler/icons-react";
import { formatWord } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";

export function NavUser() {
  const { isMobile } = useSidebar();
  const handleSignout = useSignout();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { user, setCurrentRole } = useAuth();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage
                  src={user?.image || DEFAULT_PROFILE_IMAGE}
                  alt={`${user?.firstName}'s picture` || ""}
                />
                <AvatarFallback className="rounded-md">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage
                    src={user?.image || DEFAULT_PROFILE_IMAGE}
                    alt={user?.firstName}
                  />
                  <AvatarFallback className="rounded-md">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {user?.schoolRoles.length > 1 &&
              user?.schoolRoles.map((role, index) => {
                const href = getDashboardPath(role.role) || "/dashboard";
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setCurrentRole(role.role);
                      router.push(href);
                    }}
                  >
                    <IconUser
                      size={16}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    <span>Switch to {formatWord[role.role]}</span>
                  </DropdownMenuItem>
                );
              })}

            {(user.role === "ADMINISTRATOR" ||
              user.schoolRoles.some(
                (role) => role.role === "ADMINISTRATOR"
              )) && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.username}`}>
                    <IconUser
                      size={16}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                    <span>View profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-4" />
                  <span>Light mode</span>
                </>
              ) : (
                <>
                  <Moon className="size-4" />
                  <span>Dark mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
