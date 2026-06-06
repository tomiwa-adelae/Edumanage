"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";

export const FullLogo = () => {
  const { user } = useAuth();
  const { state, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";
  return (
    <div
      className={cn("flex items-center gap-2", isCollapsed && "justify-center")}
    >
      {/* FullLogo icon */}
      <Logo />
      {/* Show text only when expanded */}
      {!isCollapsed && (
        <div className="space-y-0">
          <h1 className="font-medium text-lg line-clamp-1">
            {user?.school?.name}
          </h1>
          <p className="text-primary-foreground/70 text-sm -mt-1">
            School Management
          </p>
        </div>
      )}
    </div>
  );
};

export const Logo = () => {
  const { state } = useSidebar();
  const { user } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn("flex items-center gap-2", isCollapsed && "justify-center")}
    >
      {/* FullLogo icon */}
      {user?.school?.logo ? (
        <div className="rounded-md overflow-hidden">
          <Image
            src={user.school.logo}
            alt={`${user.school.name}'s logo`}
            width={1000}
            height={1000}
            className="object-cover aspect-video size-[45px] md:size-[55px]"
          />
        </div>
      ) : (
        <div className="p-3 bg-white dark:bg-card rounded-md flex items-center justify-center">
          <span className="text-primary font-bold text-lg">
            {user?.school?.acronym}
          </span>
        </div>
      )}
    </div>
  );
};
