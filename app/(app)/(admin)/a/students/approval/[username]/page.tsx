"use client";
import { DetailsSkeleton } from "@/components/DetailsSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import api from "@/lib/api";
import { schoolService } from "@/lib/school";
import { cn, formatDate, formatPhoneNumber } from "@/lib/utils";
import { Class, useAuth, User } from "@/store/useAuth";
import {
  IconActivity,
  IconAward,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconFileDescription,
  IconMail,
  IconMapPin2,
  IconPhone,
  IconSchool,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StudentRejectionModal } from "@/components/StudentRejectionModal";
import { StudentApprovalModal } from "@/components/StudentApprovalModal";
import { Loader } from "@/components/Loader";

const page = () => {
  const { user } = useAuth();

  const { username } = useParams();
  const [pendingApproval, startApprovalTransition] = useTransition();
  const [pendingRejection, startRejectionTransition] = useTransition();
  const [pendingApproveStudent, startApproveStudentTransition] =
    useTransition();

  const [student, setStudent] = useState<User>();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [studentRejectModalOpen, setStudentRejectModalOpen] = useState(false);
  const [studentApprovalModalOpen, setStudentApprovalModalOpen] =
    useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !user.school?.id || !username) return;

      try {
        const student = await schoolService.getPendingStudentDetails(
          user?.school?.id!,
          username!
        );
        const classes = await schoolService.getSchoolClasses(
          user?.school?.schoolID!
        );

        setStudent(student);
        setClasses(classes);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, username]);

  const openRejectModal = (doc: any) => {
    setSelectedDocument(doc);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectRemark.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedDocument) {
      handleDocumentAction(selectedDocument.id, "rejected");
    }
  };

  const handleDocumentAction = (id: string, type: "approved" | "rejected") => {
    if (type === "approved") {
      startApprovalTransition(async () => {
        try {
          const res = await api.put(
            `/students/${id}/${student?.id}/${user?.school?.id}/update-document/${type}`
          );
          toast.success(res.data.message);

          const [updatedStudent] = await Promise.all([
            schoolService.getPendingStudentDetails(
              user?.school?.id!,
              username!
            ),
          ]);

          setStudent(updatedStudent);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      });
    } else {
      startRejectionTransition(async () => {
        try {
          const res = await api.put(
            `/students/${id}/${student?.id}/${user?.school?.id}/update-document/${type}`,
            { remarks: rejectRemark }
          );
          toast.success(res.data.message);

          const [updatedStudent] = await Promise.all([
            schoolService.getPendingStudentDetails(
              user?.school?.id!,
              username!
            ),
          ]);

          setStudent(updatedStudent);
          setRejectModalOpen(false);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      });
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Details"
          description="Loading student information..."
          back
        />
        <DetailsSkeleton sections={6} showAvatar={true} />
      </div>
    );

  if (!student) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Student Details`}
        description={`Complete information about ${student.firstName} ${student.lastName}`}
        // destructiveCTA={{
        //   label: "Delete",
        //   slug: ``,
        //   icon: IconTrash,
        // }}
        back
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="col-span-1 lg:col-span-3">
          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="text-center flex flex-col items-center justify-center gap-4">
                  <UserProfilePicture
                    size="lg"
                    src={student?.image}
                    alt={`${student?.firstName}'s picture`}
                  />
                  <div className="space-y-1.5">
                    <p className="text-base lg:text-lg font-medium">
                      {student.title} {student.firstName} {student.lastName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {student.Student.candidateNumber}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <Badge
                        variant={
                          student?.Student.isApproved
                            ? "default"
                            : student?.Student.isRejected
                            ? "destructive"
                            : "pending"
                        }
                      >
                        {student?.Student.isApproved
                          ? "Approved"
                          : student?.Student.isRejected
                          ? "Application rejected"
                          : "Pending approval"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4 text-muted-foreground text-sm">
                  <div className="flex items-start justify-start gap-2">
                    <IconSchool className="size-5" />
                    <div>
                      <p className="text-xs">Class</p>
                      <p className="text-black dark:text-white font-medium">
                        {student.Student.desiredClass}
                      </p>
                    </div>
                  </div>
                  {student?.Student.desiredClass &&
                    ["SS1", "SS2", "SS3"].includes(
                      student?.Student?.desiredClass
                    ) && (
                      <div className="flex items-start justify-start gap-2">
                        <IconBuilding className="size-5" />
                        <div>
                          <p className="text-xs">Department</p>
                          <p className="text-black dark:text-white font-medium">
                            {student.department || (
                              <span className="italic">
                                No department selected
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  <div className="flex items-start justify-start gap-2">
                    <IconUser className="size-5" />
                    <div>
                      <p className="text-xs">Gender</p>
                      <p className="text-black dark:text-white font-medium">
                        {student.gender || (
                          <span className="italic">No gender selected</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-start gap-2">
                    <IconCalendar className="size-5" />
                    <div>
                      <p className="text-xs">Date of Birth</p>
                      <p className="text-black dark:text-white font-medium">
                        {formatDate(student.dob) || (
                          <span className="italic">No Date of Birth</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-start gap-2">
                    <IconAward className="size-5" />
                    <div>
                      <p className="text-xs">Candidate Number</p>
                      <p className="text-black dark:text-white font-medium">
                        {student.Student.candidateNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-muted-foreground text-sm">
                <div className="flex items-start justify-start gap-2">
                  <IconMail className="size-5" />
                  <div>
                    <p className="text-xs">Email</p>
                    <p className="text-black dark:text-white font-medium">
                      {student.email ? (
                        <a
                          className="hover:underline hover:text-primary"
                          href={`mailto:${student.email}`}
                        >
                          {student.email}
                        </a>
                      ) : (
                        <span className="italic">No email</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-start gap-2">
                  <IconPhone className="size-5" />
                  <div>
                    <p className="text-xs">Phone</p>
                    <p className="text-black dark:text-white font-medium">
                      {student.phoneNumber ? (
                        <a
                          className="hover:underline hover:text-primary"
                          href={`tel:${student.phoneNumber}`}
                        >
                          {formatPhoneNumber(student.phoneNumber)}
                        </a>
                      ) : (
                        <span className="italic">No phone</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-start gap-2">
                  <IconMapPin2 className="size-5" />
                  <div>
                    <p className="text-xs">Address</p>
                    <p className="text-black dark:text-white font-medium">
                      {student.address ? (
                        <p className="hover:underline hover:text-primary">
                          {student.address}, {student.city}, {student.state},{" "}
                          {student.country}
                        </p>
                      ) : (
                        <span className="italic">No address</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconUsers className="size-4" />
                  Parents/Guardians Details
                </CardTitle>
              </CardHeader>
              <CardContent
                className={cn(
                  "grid gap-4 grid-cols-1",
                  student.Student.ParentStudentLink.length > 1 &&
                    "lg:grid-cols-2"
                )}
              >
                {student.Student.ParentStudentLink.map((parent, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        {parent.relation}
                        <Badge variant={"secondary"}>{parent.relation}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm grid gap-4">
                      <div>
                        <p className="text-xs">Name</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.title}{" "}
                          {parent.parent.user?.firstName}{" "}
                          {parent.parent.user?.lastName}{" "}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs">Phone</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.phoneNumber ? (
                            <a href={`tel:${parent.parent.user?.phoneNumber}`}>
                              {formatPhoneNumber(
                                parent.parent.user?.phoneNumber
                              )}
                            </a>
                          ) : (
                            <span className="italic">No phone</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs">Phone</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.email ? (
                            <a href={`mailto:${parent.parent.user?.email}`}>
                              {parent.parent.user?.email}
                            </a>
                          ) : (
                            <span className="italic">No email</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs">Occupation</p>
                        <p className="font-medium text-black dark:text-white">
                          {parent.parent.user?.occupation ? (
                            parent.parent.user.occupation
                          ) : (
                            <span className="italic">No occupation</span>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconCalendar className="size-4" />
                  Enrollment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs">Applied for:</p>
                  <p className="text-black dark:text-white font-medium">
                    {student.Student.desiredClass}
                  </p>
                </div>
                <div>
                  <p className="text-xs">Applied:</p>
                  <p className="text-black dark:text-white font-medium">
                    {formatDate(student.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconFileDescription className="size-4" />
                  Documents uploaded
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm grid grid-cols-1 gap-3">
                {student.Student.documents &&
                student.Student.documents.length > 0 ? (
                  student.Student.documents.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <IconFileDescription className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-black dark:text-white text-sm">
                            {doc.type
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                doc.verified
                                  ? "success"
                                  : doc.status === "under-review"
                                  ? "pending"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {doc.verified ? (
                                "Verified"
                              ) : doc.status === "under-review" ? (
                                "Under Review"
                              ) : (
                                <span className="capitalize">{doc.status}</span>
                              )}
                            </Badge>
                            {doc.reviewedAt && (
                              <span className="text-xs text-muted-foreground">
                                Reviewed: {formatDate(doc.reviewedAt)}
                              </span>
                            )}
                          </div>
                          {doc.remarks && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Remarks: {doc.remarks}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(doc.url, "_blank")}
                          >
                            <IconEye className="size-4 mr-2" />
                            View Document
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = doc.url;
                              link.download = doc.name;
                              link.click();
                            }}
                          >
                            <IconDownload className="size-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!doc.verified && (
                            <DropdownMenuItem
                              onSelect={() =>
                                handleDocumentAction(doc.id, "approved")
                              }
                              disabled={pendingApproval}
                              className="text-green-600 focus:text-green-600"
                            >
                              {pendingApproval ? (
                                <Loader text="Approving..." />
                              ) : (
                                <>
                                  <IconCheck className="size-4 mr-2" />
                                  Approve Document
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => openRejectModal(doc)}
                            className="text-destructive focus:text-destructive"
                          >
                            <IconX className="size-4 mr-2" />
                            Reject Document
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <IconFileDescription className="size-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-start gap-2">
                  <IconActivity className="size-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm grid grid-cols-1 gap-3">
                <Button
                  onClick={() => setStudentApprovalModalOpen(true)}
                  variant={"success"}
                  className="w-full"
                  disabled={student.Student.isApproved}
                >
                  {pendingApproveStudent ? (
                    <Loader text="Approving..." />
                  ) : (
                    <>
                      <IconCheck />
                      Approve student
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setStudentRejectModalOpen(true)}
                  variant="destructive"
                  className="w-full"
                  disabled={student.Student.isRejected}
                >
                  <IconX />
                  Reject student
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reject Document Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document. The student
              will be able to see this feedback.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="my-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <IconFileDescription className="size-5 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {selectedDocument.type
                    .split("_")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason for Rejection *</Label>
            <Textarea
              id="reject-reason"
              placeholder="E.g., The document is not clear enough, please upload a higher quality image..."
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {rejectRemark.length}/500 characters
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectRemark("");
                setSelectedDocument(null);
              }}
              disabled={pendingRejection}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={pendingRejection || !rejectRemark.trim()}
            >
              {pendingRejection ? (
                <Loader text="Rejecting..." />
              ) : (
                "Reject Document"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {studentRejectModalOpen && (
        <StudentRejectionModal
          open={studentRejectModalOpen}
          onClose={(student) => {
            setStudentRejectModalOpen(false);
            setStudent(student);
          }}
          student={student}
        />
      )}

      {studentApprovalModalOpen && (
        <StudentApprovalModal
          classes={classes}
          open={studentApprovalModalOpen}
          onClose={(student) => {
            setStudentApprovalModalOpen(false);
            setStudent(student);
          }}
          student={student}
        />
      )}
    </div>
  );
};

export default page;
