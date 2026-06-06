"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { FullLogo } from "@/app/(app)/(admin)/a/_components/Logo";
import { getDashboardPath } from "@/hooks/use-role-redirect";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogoClick = () => {
    if (!user) return;
    const path = getDashboardPath(user.role);
    router.push(path);
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <FullLogo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
