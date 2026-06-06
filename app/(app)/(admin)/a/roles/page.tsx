"use client";
import { PageHeader } from "@/components/PageHeader";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { RolesCards } from "../_components/RolesCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  IconLock,
  IconUserCheck,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { UserRoles } from "./_components/UserRoles";
import { useAuth, User } from "@/store/useAuth";
import { schoolService } from "@/lib/school";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import { CardsSkeleton } from "@/components/CardsSkeleton";
import { RolesDefinitions } from "./_components/RolesDefinitions";
import { Permissions } from "./_components/Permissions";
import { configService } from "@/lib/configs";
import { PaginationMeta } from "@/lib/types/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { Loader } from "@/components/Loader";

const RolesPageContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [parents, setParents] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [usersMeta, setUsersMeta] = useState<PaginationMeta | null>(null);
  const [teachersMeta, setTeachersMeta] = useState<PaginationMeta | null>(null);
  const [parentsMeta, setParentsMeta] = useState<PaginationMeta | null>(null);
  const [studentsMeta, setStudentsMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobRoles, setJobRoles] = useState<any>([]);

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
        const [
          usersResponse,
          teachersResponse,
          parentsResponse,
          studentsResponse,
          admins,
          jobRoles,
        ] = await Promise.all([
          schoolService.getSchoolUsers(user?.schoolId!, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
          schoolService.getSchoolTeachers(user?.schoolId!, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
          schoolService.getSchoolParents(user?.schoolId!, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
          schoolService.getStudents(user?.schoolId!, {
            page: currentPage,
            limit,
            search: search || undefined,
          }),
          schoolService.getSchoolAdmins(user?.schoolId!),
          configService.getCategory("JOB_ROLE"),
        ]);

        if (isMounted) {
          // Extract data from paginated responses
          setUsers(usersResponse.data || []);
          setTeachers(teachersResponse.data || []);
          setParents(parentsResponse.data || []);
          setStudents(studentsResponse.data || []);
          setUsersMeta(usersResponse.meta || null);
          setTeachersMeta(teachersResponse.meta || null);
          setParentsMeta(parentsResponse.meta || null);
          setStudentsMeta(studentsResponse.meta || null);
          setAdmins(admins);
          setJobRoles(jobRoles);
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error(error.response?.data?.message || "Failed to fetch roles");
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

  const handleRefresh = useCallback(async () => {
    if (!user?.schoolId) return;

    setLoading(true);
    try {
      const [
        usersResponse,
        teachersResponse,
        parentsResponse,
        studentsResponse,
        admins,
        jobRoles,
      ] = await Promise.all([
        schoolService.getSchoolUsers(user?.schoolId!, {
          page: currentPage,
          limit,
          search: search || undefined,
        }),
        schoolService.getSchoolTeachers(user?.schoolId!, {
          page: currentPage,
          limit,
          search: search || undefined,
        }),
        schoolService.getSchoolParents(user?.schoolId!, {
          page: currentPage,
          limit,
          search: search || undefined,
        }),
        schoolService.getStudents(user?.schoolId!, {
          page: currentPage,
          limit,
          search: search || undefined,
        }),
        schoolService.getSchoolAdmins(user?.schoolId!),
        configService.getCategory("JOB_ROLE"),
      ]);

      // Extract data from paginated responses
      setUsers(usersResponse.data || []);
      setTeachers(teachersResponse.data || []);
      setParents(parentsResponse.data || []);
      setStudents(studentsResponse.data || []);
      setUsersMeta(usersResponse.meta || null);
      setTeachersMeta(teachersResponse.meta || null);
      setParentsMeta(parentsResponse.meta || null);
      setStudentsMeta(studentsResponse.meta || null);
      setAdmins(admins);
      setJobRoles(jobRoles);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles, permissions, and access control for the school system"
      />

      {loading ? (
        <CardsSkeleton count={1} />
      ) : (
        <RolesCards total={usersMeta?.total || users.length || 0} />
      )}

      <Tabs defaultValue="users">
        <ScrollArea>
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="users">
              <IconUsersGroup
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="roles" className="group">
              <IconUserCheck
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Roles Definitions
            </TabsTrigger>
            <TabsTrigger value="permissions" className="group">
              <IconLock
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Permissions
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="users">
          {loading ? (
            <TableSkeleton columns={5} rows={limit} />
          ) : (
            <UserRoles
              users={users}
              onRefresh={() => handleRefresh()}
              jobRoles={jobRoles.items}
            />
          )}
        </TabsContent>
        <TabsContent value="roles">
          <RolesDefinitions
            teachers={teachersMeta?.total || teachers.length || 0}
            students={studentsMeta?.total || students.length || 0}
            admins={admins.length || 0}
            parents={parentsMeta?.total || parents.length || 0}
          />
        </TabsContent>
        <TabsContent value="permissions">
          <Permissions />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {!loading && usersMeta && usersMeta.total > 0 && (
        <Pagination
          meta={usersMeta}
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
      <RolesPageContent />
    </Suspense>
  );
};

export default page;
