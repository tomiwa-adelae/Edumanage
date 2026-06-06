"use client";
import { AccountPendingModal } from "@/components/AccountPendingModal";
import { Assignment, useAuth } from "@/store/useAuth";
import { useEffect, useState } from "react";
import { RejectedApprovalBanner } from "../_components/RejectedApprovalBanner";
import { PageHeader } from "@/components/PageHeader";
import { studentService } from "@/lib/student";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconFileDescription,
  IconFileText,
  IconUser,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NothingFound } from "@/components/NothingFound";
import Link from "next/link";

const ItemCard = ({ item }: { item: Assignment }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start gap-4 justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-3 rounded-md bg-green-500/10`}>
              <IconFileText className="size-5 text-green-500" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/s/notes/${item.slug || item.id}`}
                    className="font-medium text-lg line-clamp-1 hover:underline hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  {/* <Badge variant={"outlineSuccess"} className="text-xs">
                    {item.type}
                  </Badge> */}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <IconFileDescription className="size-4" />
                  <span>{item.subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCalendar className="size-4" />
                  <span>Assigned: {formatDate(item.createdAt)}</span>
                </div>
                {/* <div className="flex text-red-600 items-center gap-2">
                  <IconClock className="size-4" />
                  <span>Due: {formatDate(item.dueDate)}</span>
                </div> */}
                <div className="flex items-center gap-2">
                  <IconUser className="size-4" />
                  <span>
                    Teacher: {item.Teacher.user?.title}{" "}
                    {item.Teacher.user?.firstName} {item.Teacher.user?.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 w-full lg:w-auto">
            <Button
              variant="outline"
              className="w-full lg:w-auto hover:bg-gray-100"
            >
              <IconEye className="size-4" /> <span>View</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const page = () => {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Assignment[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId) return;

      try {
        const [notes] = await Promise.all([
          studentService.getStudentNotes(user?.school?.id!, user.id),
        ]);

        setNotes(notes);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {user?.Student?.applicationStatus === "pending" && (
        <AccountPendingModal />
      )}
      {user?.Student?.applicationStatus === "rejected" && (
        <RejectedApprovalBanner reasons={user?.Student?.rejectionReason} />
      )}
      <PageHeader
        title="My Notes"
        description="View all your notes from your classes"
      />
      <SearchBarWrapper placeholder="Search notes..." />
      <div className="space-y-6">
        {notes.length === 0 && <NothingFound message="No notes found" />}
        {notes.map((document) => (
          <ItemCard key={document.id} item={document} />
        ))}
      </div>
    </div>
  );
};

export default page;
