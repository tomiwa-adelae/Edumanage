"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
// import { adminNavLinks } from "@/constant";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/store/useAuth";
import { roleNavMap } from "@/constant/nav-links";
import { Badge } from "../ui/badge";

export function NavMain() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";
  const pathname = usePathname();
  // const { user } = useAuth();

  // ✅ pick the correct nav links based on role
  // const navLinks = roleNavMap[user?.role as keyof typeof roleNavMap] || [];

  const { user, currentRole } = useAuth();
  const activeRole = currentRole || user?.role;
  const navLinks = roleNavMap[activeRole as keyof typeof roleNavMap] || [];

  return (
    <SidebarGroup>
      <SidebarMenu
        className={cn("flex flex-col gap-2", isCollapsed && "items-center")}
      >
        {navLinks.map((item) => {
          const isSectionActive = item.items?.some(
            (sub: any) => pathname === sub.url
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isSectionActive} // auto open section if a child is active
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {/* Parent link */}
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      `font-medium hover:text-primary text-xs ${
                        isCollapsed
                          ? "justify-center w-12 h-12 p-0"
                          : "justify-start px-3"
                      }`,
                      isSectionActive &&
                        "bg-white dark:bg-sidebar text-primary dark:text-white font-medium"
                    )}
                    onClick={() => {
                      // Close sidebar on mobile if top-level link is clicked
                      if (isMobile && !item.items?.length) {
                        setOpenMobile(false);
                      }
                    }}
                  >
                    {item.icon && (
                      <item.icon
                        className={isCollapsed ? "size-6" : "size-4"}
                      />
                    )}
                    {(!isCollapsed || isMobile) && <span>{item.title}</span>}
                    {!isCollapsed && item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Submenu */}
                {(!isCollapsed || isMobile) && item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem: any) => {
                        const isActive = pathname.startsWith(subItem.url);
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            {subItem.comingSoon ? (
                              <SidebarMenuSubButton className="cursor-not-allowed hover:text-black">
                                {subItem.icon && (
                                  <subItem.icon className="text-muted-foreground" />
                                )}
                                <span className="flex items-center gap-2">
                                  {subItem.title}
                                  <Badge variant="secondary">Soon</Badge>
                                </span>
                              </SidebarMenuSubButton>
                            ) : (
                              <SidebarMenuSubButton
                                size="md"
                                asChild
                                className={cn(
                                  isActive &&
                                    "bg-white hover:text-primary dark:bg-sidebar-accent text-primary dark:text-white font-medium hover:[&>svg]:text-primary [&>svg]:text-primary dark:[&>svg]:text-white"
                                )}
                                onClick={() => isMobile && setOpenMobile(false)}
                              >
                                <Link href={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            )}
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
