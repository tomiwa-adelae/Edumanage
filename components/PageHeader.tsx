"use client";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  title: String | React.ReactNode;
  description?: string | React.ReactNode;
  back?: boolean;
  primaryCTA?: {
    label: string;
    slug: string;
    icon: any;
  };
  secondaryCTA?: {
    label: string;
    slug: string;
    icon: any;
  };
  destructiveCTA?: {
    label: string;
    slug: string;
    icon: any;
  };
  outlineCTA?: {
    label: string;
    slug: string;
    icon: any;
  };
}

export const PageHeader = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  outlineCTA,
  destructiveCTA,
  back,
}: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
      <div className="flex items-start justify-start gap-2">
        {back && (
          <Button onClick={() => router.back()} size="icon" variant={"ghost"}>
            <IconArrowLeft />
          </Button>
        )}
        <div className="space-y-1">
          <h1 className="font-medium text-2xl md:text-3xl 2xl:text-4xl">
            {title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-normal">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 w-full md:w-auto">
        {secondaryCTA && (
          <Button className="flex-1 md:flex-auto" asChild variant={"secondary"}>
            <Link href={secondaryCTA.slug}>
              <secondaryCTA.icon />
              {secondaryCTA.label}
            </Link>
          </Button>
        )}
        {outlineCTA && (
          <Button className="flex-1 md:flex-auto" variant={"outline"} asChild>
            <Link href={outlineCTA.slug}>
              <outlineCTA.icon />
              {outlineCTA.label}
            </Link>
          </Button>
        )}
        {primaryCTA && (
          <Button className="flex-1 md:flex-auto" asChild>
            <Link href={primaryCTA.slug}>
              <primaryCTA.icon />
              {primaryCTA.label}
            </Link>
          </Button>
        )}
        {destructiveCTA && (
          <Button
            className="flex-1 md:flex-auto"
            variant={"destructive"}
            asChild
          >
            <Link href={destructiveCTA.slug}>
              <destructiveCTA.icon />
              {destructiveCTA.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
