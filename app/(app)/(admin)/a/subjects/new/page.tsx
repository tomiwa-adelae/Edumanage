"use client";
import { PageHeader } from "@/components/PageHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconFileTypeXls, IconUserPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { configService } from "@/lib/configs";
import { useAuth } from "@/store/useAuth";
import { FormSkeleton } from "@/components/FormSkeleton";
import { AddSubjectForm } from "./_components/AddSubjectForm";
import { toast } from "sonner";
import { ImportSubjects } from "./_components/ImportSubjects";

const page = () => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState<any>();
  const [classLevels, setClassLevels] = useState<any>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!user?.schoolId) return;

      try {
        const [departments, classLevels] = await Promise.all([
          configService.getCategory("SCHOOL_DEPARTMENT"),
          configService.getCategory("CLASS_LEVEL"),
        ]);

        setDepartments(departments);
        setClassLevels(classLevels);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, [user]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create new subject"
        description="Add a new subject to the school curriculum"
        back
      />
      {loading ? (
        <FormSkeleton fields={7} showHeader={false} />
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
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="manual">
            <AddSubjectForm
              departments={departments.items}
              classLevels={classLevels?.items}
            />
          </TabsContent>
          <TabsContent value="import">
            <ImportSubjects />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default page;
