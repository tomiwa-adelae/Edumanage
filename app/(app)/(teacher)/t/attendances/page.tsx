"use client";
import { PageHeader } from "@/components/PageHeader";
import { AttendanceSearchComponent } from "../_components/AttendanceSearchComponent";
import { Class, useAuth, User } from "@/store/useAuth";
import { useEffect, useState } from "react";
import { teacherService } from "@/lib/teacher";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Button } from "@/components/ui/button";
import { IconCheck, IconClock, IconUsers, IconX } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { attendanceService } from "@/lib/attendance";
import { NothingFound } from "@/components/NothingFound";

type StudentWithStatus = User & {
  attendanceStatus?: "PRESENT" | "LATE" | "ABSENT";
};

const AttendancePage = () => {
  const { user } = useAuth();

  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<StudentWithStatus[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // default to today

  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.schoolId) return;

    const fetchClasses = async () => {
      try {
        const classes = await teacherService.getTeacherClasses(
          user?.school?.id!,
          user.id!
        );
        setClasses(classes);
        if (classes?.length > 0) setSelectedClassId(classes[0].id);
        if (classes.length === 0) setLoading(false);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  useEffect(() => {
    if (!user?.school || !selectedClassId) return;

    setLoadingStudents(true);
    const fetchStudents = async () => {
      try {
        const fetchedStudents = await teacherService.getStudentInClass(
          user?.school?.id!,
          user.id!,
          selectedClassId!
        );

        const attendance = await attendanceService.getByClassAndDate(
          user?.school?.id!,
          selectedClassId!,
          selectedDate
        );

        // 3️⃣ Merge data
        const withStatus: StudentWithStatus[] = fetchedStudents.map(
          (s: any) => {
            const att = attendance.find(
              (a: any) => a.studentId === s.Student?.id
            );
            return {
              ...s,
              attendanceStatus: att?.status || "PRESENT",
            };
          }
        );

        setStudents(withStatus);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load students"
        );
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [user, selectedClassId, selectedDate]);

  const setStudentStatus = (
    studentId: string,
    status: StudentWithStatus["attendanceStatus"]
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, attendanceStatus: status } : s
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, attendanceStatus: "PRESENT" }))
    );
  };

  const counts = {
    total: students.length,
    present: students.filter((s) => s.attendanceStatus === "PRESENT").length,
    late: students.filter((s) => s.attendanceStatus === "LATE").length,
    absent: students.filter((s) => s.attendanceStatus === "ABSENT").length,
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClassId) {
      toast.error("Select a class");
      return;
    }
    if (!user) {
      toast.error("User not found");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        classId: selectedClassId,
        schoolId: user.school?.id!,
        markedById: user.id!,
        // use today's date (ISO) — backend normalizes to midnight
        date: new Date().toISOString(),
        students: students.map((s) => ({
          studentId: s?.Student?.id || s?.Student?.id || s?.id, // depending on what teacherService returns
          status: s.attendanceStatus || "PRESENT",
        })),
      };

      const res = await api.post(
        `/attendances/${payload.schoolId}/bulk`,
        payload
      );
      toast.success(res.data?.message || "Attendance saved");
      // optionally refresh students or attendance list from server:
      // re-fetch students or show confirmation
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Mark Attendance`}
        description={"Record daily attendance for your classes"}
      />
      <AttendanceSearchComponent
        classes={classes}
        onChange={({ classId, date }) => {
          setSelectedClassId(classId);
          setSelectedDate(date);
        }}
      />
      {loadingStudents ? (
        <Loader text="Loading students..." />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex border items-center justify-between gap-1 rounded-md p-4">
              <div>
                <p className="text-muted-foreground">Total Students</p>
                <p className="font-medium text-2xl">{counts.total}</p>
              </div>
              <IconUsers className="text-primary" />
            </div>
            <div className="flex border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 items-center justify-between gap-1 rounded-md p-4">
              <div>
                <p className="text-green-500">Present</p>
                <p className="font-medium text-2xl">{counts.present}</p>
              </div>
              <IconUsers className="text-green-500" />
            </div>
            <div className="flex border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 items-center justify-between gap-1 rounded-md p-4">
              <div>
                <p className="text-red-500">Absent</p>
                <p className="font-medium text-2xl">{counts.absent}</p>
              </div>
              <IconX className="text-red-500" />
            </div>
            <div className="flex border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 items-center justify-between gap-1 rounded-md p-4">
              <div>
                <p className="text-amber-500">Late</p>
                <p className="font-medium text-2xl">{counts.late}</p>
              </div>
              <IconClock className="text-amber-500" />
            </div>
          </div>

          <Button
            disabled={students.length === 0}
            variant={"outline"}
            onClick={markAllPresent}
          >
            <IconCheck />
            Mark all present
          </Button>

          <Card>
            <CardContent className="grid gap-4">
              {students.length === 0 && (
                <NothingFound message="No students found" />
              )}
              {students.map((student) => {
                const studId = (student as any).id;
                return (
                  <Card key={studId}>
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                      <div className="flex items-center justify-start gap-2">
                        <UserProfilePicture
                          src={student?.image}
                          alt={`${student?.firstName}'s picture`}
                        />
                        <div>
                          <p className="font-medium text-base">
                            {student?.firstName} {student?.lastName}
                          </p>
                          <p className="text-muted-foreground">
                            {student?.Student?.admissionNumber ||
                              student?.Student?.candidateNumber ||
                              ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center w-full md:w-auto justify-between md:justify-end gap-2">
                        <Button
                          // size="sm"
                          variant={
                            student.attendanceStatus === "PRESENT"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setStudentStatus(studId, "PRESENT")}
                          className={`w-full md:w-auto ${
                            student.attendanceStatus === "PRESENT"
                              ? "bg-green-600 text-white"
                              : ""
                          }`}
                        >
                          <IconCheck />
                          Present
                        </Button>
                        <Button
                          // size="sm"
                          variant={
                            student.attendanceStatus === "LATE"
                              ? "pending"
                              : "outline"
                          }
                          onClick={() => setStudentStatus(studId, "LATE")}
                          className={`w-full md:w-auto  ${
                            student.attendanceStatus === "LATE"
                              ? "bg-amber-500 text-white"
                              : ""
                          }`}
                        >
                          <IconClock />
                          Late
                        </Button>
                        <Button
                          // size="sm"
                          className="w-full md:w-auto"
                          variant={
                            student.attendanceStatus === "ABSENT"
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() => setStudentStatus(studId, "ABSENT")}
                        >
                          <IconX />
                          Absent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* <Separator /> */}
              <div className="flex items-center justify-end">
                <Button
                  onClick={handleSubmitAttendance}
                  disabled={submitting || students.length === 0}
                >
                  {submitting ? (
                    <Loader text="Submitting..." />
                  ) : (
                    "Submit Attendance"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
