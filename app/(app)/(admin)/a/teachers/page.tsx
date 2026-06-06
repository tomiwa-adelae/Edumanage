"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { IconPlus } from "@tabler/icons-react";
import { schoolService } from "@/lib/school";
import { useAuth, User } from "@/store/useAuth";
import { TableSkeleton } from "@/components/TableSkeleton";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { TeachersCards } from "../_components/TeachersCard";
import { PageHeader } from "@/components/PageHeader";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { TeacherLists } from "./_components/TeacherLists";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PaginationMeta } from "@/lib/types/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { Loader } from "@/components/Loader";

const TeachersPageContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [teachers, setTeachers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<any>([]);
  const [teachersMeta, setTeachersMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // Get pagination and search params from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?.schoolId) return;

      setLoading(true);
      try {
        const [teachersResponse, assignments] = await Promise.all([
          schoolService.getSchoolTeachers(user.schoolId, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
          schoolService.getTeacherAssignments(user.school?.schoolID!),
        ]);

        if (isMounted) {
          setTeachers(teachersResponse.data || []);
          setTeachersMeta(teachersResponse.meta || null);
          setAssignments(assignments);
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error(error.response?.data?.message || "Failed to fetch teachers");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.schoolId, user?.school?.schoolID, currentPage, limit, search]);

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleLimitChange = useCallback((newLimit: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("limit", newLimit.toString());
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Assign teachers to classes and subjects"
        primaryCTA={{
          label: "New Assignment",
          slug: "/a/teachers/new",
          icon: IconPlus,
        }}
      />

      {loading ? (
        <CardsSkeleton count={2} />
      ) : (
        <TeachersCards
          assignments={assignments?.length}
          teachers={teachersMeta?.total || teachers?.length || 0}
        />
      )}

      <Card>
        <CardContent className="space-y-4">
          <SearchBarWrapper placeholder="Search teachers by name, email, subject..." />
          {loading ? (
            <TableSkeleton columns={6} rows={limit} />
          ) : (
            <TeacherLists teachers={teachers} />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && teachersMeta && teachersMeta.total > 0 && (
        <Pagination
          meta={teachersMeta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
};

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <TeachersPageContent />
    </Suspense>
  );
};

export default page;
