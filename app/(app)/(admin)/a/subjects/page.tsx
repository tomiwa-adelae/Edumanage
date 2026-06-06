"use client";
import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCategoryFilled,
  IconDownload,
  IconGridScan,
  IconPlus,
} from "@tabler/icons-react";
import { SubjectCatalog } from "./_components/SubjectCatalog";
import { useAuth } from "@/store/useAuth";
import { schoolService } from "@/lib/school";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectsCards } from "./_components/SubjectsCards";
import { configService } from "@/lib/configs";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

export type Subject = {
  name: string;
  department: string;
  description?: string;
  hoursPerWeek: string;
  passScore: string;

  classes: string[];
  id: string;
  isCore: boolean;
};

const page = () => {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<any>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId) return;

      try {
        const [subjects, departments] = await Promise.all([
          schoolService.getSchoolSubjects(user?.school?.schoolID!),
          configService.getCategory("SCHOOL_DEPARTMENT"),
        ]);

        setSubjects(subjects);
        setDepartments(departments);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects"
        description="Structured curriculum management and class organization"
        primaryCTA={{
          label: "Add Subject",
          slug: "/a/subjects/new",
          icon: IconPlus,
        }}
      />
      {loading ? (
        <CardsSkeleton count={2} />
      ) : (
        <SubjectsCards
          subjects={subjects.length}
          departments={departments.items.length}
        />
      )}
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Tabs defaultValue="catalog">
          <ScrollArea>
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="catalog">
                <IconCategoryFilled
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Subject Catalog
              </TabsTrigger>
              <TabsTrigger value="mapping" className="group">
                <IconGridScan
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Subject Mapping
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="catalog">
            <SubjectCatalog subjects={subjects} />
          </TabsContent>
          <TabsContent value="mapping">
            <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
              Content for Tab 3
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default page;
