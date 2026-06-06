"use client";
import React, { useEffect, useState } from "react";
import { ClassesCards } from "../_components/ClassesCards";
import { IconPlus } from "@tabler/icons-react";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { schoolService } from "@/lib/school";
import { Class, School, useAuth, User } from "@/store/useAuth";
import { ClassSearchComponent } from "../_components/ClassSearchComponent";
import { ClassBox } from "./_components/ClassBox";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { NothingFound } from "@/components/NothingFound";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState<Class[]>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId) return;

      try {
        const [classes] = await Promise.all([
          schoolService.getSchoolClasses(user?.school?.schoolID!),
        ]);

        setClasses(classes);
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
        title="Classes"
        description="Manage all classes and their details"
        primaryCTA={{
          label: "Create Class",
          slug: "/a/classes/new",
          icon: IconPlus,
        }}
        // secondaryCTA={{
        //   label: "Bulk Create",
        //   slug: "/a/classes/new",
        //   icon: IconPlus,
        // }}
      />
      {loading ? (
        <CardsSkeleton count={1} />
      ) : (
        <ClassesCards classes={classes?.length} />
      )}
      <ClassSearchComponent />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          {classes?.length === 0 && (
            <NothingFound message="No classes found yet!" />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes?.map((c) => (
              <ClassBox key={c.id} schoolClass={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default page;
