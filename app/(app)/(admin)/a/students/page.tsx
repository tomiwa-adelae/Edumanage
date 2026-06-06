"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { IconDownload, IconPlus } from "@tabler/icons-react";
import { StudentCards } from "../_components/StudentCards";
import { StudentSearchComponent } from "../_components/StudentSearchComponent";
import { StudentsLists } from "./_components/StudentsLists";
import { PageHeader } from "@/components/PageHeader";
import { useAuth, User } from "@/store/useAuth";
import { schoolService } from "@/lib/school";
import { TableSkeleton } from "@/components/TableSkeleton";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { PaginatedResponse } from "@/lib/types/pagination";
import { Pagination } from "@/components/Pagination";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Loader } from "@/components/Loader";

const StudentsPageContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [studentsData, setStudentsData] =
    useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);

  // Get pagination params from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    let isMounted = true;

    const fetchStudents = async () => {
      if (!user?.schoolId) return;

      setLoading(true);
      try {
        const data = await schoolService.getStudents(user.schoolId, {
          page: currentPage,
          limit,
          search: search || undefined,
        });

        if (isMounted) {
          setStudentsData(data);
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error(
            error?.response?.data?.message || "Failed to fetch students"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudents();

    return () => {
      isMounted = false;
    };
  }, [user?.schoolId, currentPage, limit, search]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set("limit", newLimit.toString());
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const students = studentsData?.data || [];
  const meta = studentsData?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Manage student records and information"
        primaryCTA={{
          label: "Add Students",
          slug: "/a/students/new",
          icon: IconPlus,
        }}
      />

      {loading ? (
        <CardsSkeleton count={1} />
      ) : (
        <StudentCards students={meta?.total || 0} />
      )}

      {/* Search Bar */}
      <SearchBarWrapper placeholder="Search students by name, email, admission number..." />

      {loading ? (
        <TableSkeleton columns={7} rows={limit} />
      ) : (
        <StudentsLists students={students} />
      )}

      {/* Pagination */}
      {!loading && meta && meta.total > 0 && (
        <Pagination
          meta={meta}
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
      <StudentsPageContent />
    </Suspense>
  );
};

export default page;
