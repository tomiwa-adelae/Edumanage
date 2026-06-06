"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IconFileTypeXls, IconShare, IconUserPlus } from "@tabler/icons-react";
import { configService } from "@/lib/configs";
import { AddStaffForm } from "../_components/AddStaffForm";
import InviteStaff from "../_components/InviteStaff";
import { PageHeader } from "@/components/PageHeader";
import { ImportStaff } from "../_components/ImportStaff";
import { toast } from "sonner";
import { FormSkeleton } from "@/components/FormSkeleton";

const page = () => {
  const [loading, setLoading] = useState(true);

  const [jobRoles, setJobRoles] = useState<any>();
  const [states, setStates] = useState<any>();
  const [countries, setCountries] = useState<any>();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [jobRoles, states, countries] = await Promise.all([
          configService.getCategory("JOB_ROLE"),
          configService.getCategory("STATE"),
          configService.getCategory("COUNTRY"),
        ]);

        setJobRoles(jobRoles);
        setStates(states);
        setCountries(countries);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Staff"
        description="Add a new staff manually or import from Excel/CSV or invite"
        back
      />
      {loading ? (
        <FormSkeleton fields={10} showHeader={false} columns={2} />
      ) : (
        <Tabs defaultValue="manual">
          <ScrollArea>
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="manual">
                <IconUserPlus
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="import" className="group">
                <IconFileTypeXls
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Import from file
              </TabsTrigger>
              <TabsTrigger value="invite" className="group">
                <IconShare
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Invite Link
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="manual">
            <AddStaffForm
              countries={countries.items}
              states={states.items}
              jobRoles={jobRoles.items}
            />
          </TabsContent>
          <TabsContent value="import">
            <ImportStaff />
          </TabsContent>
          <TabsContent value="invite">
            <InviteStaff />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default page;
