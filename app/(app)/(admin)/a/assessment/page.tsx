"use client";
import React from "react";
import {
  IconAward,
  IconCalendar,
  IconCircleDashedLetterA,
  IconDownload,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import { AssessmentCards } from "../_components/AssessmentCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AssessmentTypes } from "./_components/AssessmentTypes";
import { GradingSchemes } from "./_components/GradingSchemes";
import { PageHeader } from "@/components/PageHeader";

const page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessment Setup"
        description="Configure assessment types, grading schemes, and evaluation criteria"
        primaryCTA={{
          label: "Create Assessment",
          slug: "/a/students/new",
          icon: IconPlus,
        }}
        secondaryCTA={{
          label: "Import Template",
          slug: "/a/students/new",
          icon: IconDownload,
        }}
      />
      <AssessmentCards />
      <Tabs defaultValue="catalog">
        <ScrollArea>
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="catalog">
              <IconCircleDashedLetterA
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Assessment Types
            </TabsTrigger>
            <TabsTrigger value="structure" className="group">
              <IconAward
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Grading Schemes
            </TabsTrigger>
            <TabsTrigger value="mapping" className="group">
              <IconCalendar
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Exam Schedules
            </TabsTrigger>
            <TabsTrigger value="mapping" className="group">
              <IconTrendingUp
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Analytics
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="catalog">
          <AssessmentTypes />
        </TabsContent>
        <TabsContent value="structure">
          <GradingSchemes />
        </TabsContent>
        <TabsContent value="mapping">
          <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
