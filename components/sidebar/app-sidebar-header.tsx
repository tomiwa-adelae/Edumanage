"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { IconBell } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Logo } from "@/app/(app)/(admin)/a/_components/Logo";
import { UserDropdown } from "@/app/(app)/(admin)/a/_components/UserDropdown";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { getDashboardPath } from "@/hooks/use-role-redirect";

export const AppSidebarHeader = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    if (!user) return;
    const path = getDashboardPath(user.role);
    router.push(path);
  };
  return (
    <header className="sticky z-20 top-0 bg-background border-b flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20">
      <div className="flex items-center justify-between w-full gap-2 px-4">
        <div className="flex-1 flex items-center gap-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <div className="md:hidden cursor-pointer" onClick={handleLogoClick}>
            <Logo />
          </div>
        </div>
        <div className="flex flex-1 lg:flex-2 xl:flex-1 w-full items-center justify-end gap-2">
          <div className="hidden w-full md:block">
            <SearchBarWrapper />
          </div>
          <Button
            size="icon"
            variant={"secondary"}
            className="relative hidden md:inline-flex"
          >
            <Badge
              variant={"destructive"}
              className="absolute -top-2 -right-2 rounded-full text-xs"
            >
              3
            </Badge>
            <IconBell />
          </Button>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};
