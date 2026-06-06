"use client";
import React from "react";
import {
  IconBrandStackoverflow,
  IconDownload,
  IconPlus,
  IconReplaceUser,
  IconTopologyFullHierarchy,
} from "@tabler/icons-react";
import { FeesCards } from "../_components/FeesCards";
import { FeesSearchComponent } from "../_components/FeesSearchComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PaymentOverview } from "./_components/PaymentOverview";
import { FeeStructures } from "./_components/FeeStructures";
import { PageHeader } from "@/components/PageHeader";

const page = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees & Payments"
        description="Manage fee structures and track payments"
        primaryCTA={{
          label: "Add Fee Structure",
          slug: "/a/staff/new",
          icon: IconPlus,
        }}
        secondaryCTA={{
          label: "Export Report",
          slug: "/a/staff/new",
          icon: IconDownload,
        }}
      />
      <FeesCards />
      <Tabs defaultValue="catalog">
        <ScrollArea>
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="catalog">
              <IconBrandStackoverflow
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Payment Overview
            </TabsTrigger>
            <TabsTrigger value="structure" className="group">
              <IconTopologyFullHierarchy
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Fee Structure
            </TabsTrigger>
            <TabsTrigger value="mapping" className="group">
              <IconReplaceUser
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Transactions
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="catalog">
          <PaymentOverview />
        </TabsContent>
        <TabsContent value="structure">
          <FeeStructures />
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
