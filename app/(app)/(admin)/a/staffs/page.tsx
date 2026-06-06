"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { StaffCards } from "../_components/StaffCards";
import { PageHeader } from "../../../../../components/PageHeader";
import { IconDownload, IconPlus } from "@tabler/icons-react";
import { StaffsLists } from "./_components/StaffsLists";
import { schoolService } from "@/lib/school";
import { useAuth, User } from "@/store/useAuth";
import { toast } from "sonner";
import { PaginatedResponse, PaginationMeta } from "@/lib/types/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { TableSkeleton } from "@/components/TableSkeleton";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { Loader } from "@/components/Loader";

const StaffsPageContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [staffs, setStaffs] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [staffsMeta, setStaffsMeta] = useState<PaginationMeta | null>(null);
  const [teachersMeta, setTeachersMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // Get pagination and search params from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    let isMounted = true;

    const fetchStaffs = async () => {
      if (!user?.schoolId) return;

      setLoading(true);
      try {
        const [staffsResponse, teachersResponse] = await Promise.all([
          schoolService.getSchoolStaffs(user.schoolId, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
          schoolService.getSchoolTeachers(user.schoolId, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
        ]);

        if (isMounted) {
          setStaffs(staffsResponse.data || []);
          setTeachers(teachersResponse.data || []);
          setStaffsMeta(staffsResponse.meta || null);
          setTeachersMeta(teachersResponse.meta || null);
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error(error.response?.data?.message || "Failed to fetch staffs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStaffs();

    return () => {
      isMounted = false;
    };
  }, [user?.schoolId, currentPage, limit, search]);

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
        title="Staff Management"
        description="Manage staff members and their information"
        primaryCTA={{
          label: "Add Staff member",
          slug: "/a/staffs/new",
          icon: IconPlus,
        }}
      />

      {loading ? (
        <CardsSkeleton count={4} />
      ) : (
        <StaffCards
          teachers={teachersMeta?.total || teachers?.length || 0}
          total={staffsMeta?.total || staffs?.length || 0}
          onLeave={0}
          active={staffsMeta?.total || staffs?.length || 0}
        />
      )}

      {/* Search Bar */}
      <SearchBarWrapper placeholder="Search staff by name, email, role..." />

      {loading ? (
        <TableSkeleton columns={7} rows={limit} />
      ) : (
        <StaffsLists staffs={staffs} />
      )}

      {/* Pagination */}
      {!loading && staffsMeta && staffsMeta.total > 0 && (
        <Pagination
          meta={staffsMeta}
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
      <StaffsPageContent />
    </Suspense>
  );
};

export default page;
