"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  IconPlus,
  IconSearch,
  IconFileText,
  IconBook,
  IconClipboard,
  IconClock,
  IconEye,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconUsers,
} from "@tabler/icons-react";
import { AssignmentsCards } from "../_components/AssignmentsCards";
import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Assignment, useAuth } from "@/store/useAuth";
import { teacherService } from "@/lib/teacher";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";
import { formatDate } from "@/lib/utils";
import { Item } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { NothingFound } from "@/components/NothingFound";

const ItemCard = ({ item }: { item: Assignment }) => {
  const isAssignment = item.type === "ASSIGNMENT";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start gap-4 justify-between">
          <div className="flex items-start gap-4 flex-1 w-full">
            <div
              className={`p-3 rounded-md ${
                item.type === "ASSIGNMENT"
                  ? "bg-primary/10"
                  : item.type === "lesson note"
                  ? "bg-purple-50"
                  : "bg-green-50"
              }`}
            >
              {item.type === "ASSIGNMENT" ? (
                <IconFileText className="w-6 h-6 text-blue-600" />
              ) : item.type === "lesson note" ? (
                <IconBook className="w-6 h-6 text-purple-600" />
              ) : (
                <IconFileText className="w-6 h-6 text-green-600" />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/t/assignments/${item.slug || item.id}`}
                    className="font-medium text-lg line-clamp-1 hover:underline hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <Badge
                    variant={
                      item.type === "ASSIGNMENT"
                        ? "outlinePrimary"
                        : item.type === "HOMEWORK"
                        ? "outlineSuccess"
                        : "outlinePurple"
                    }
                    className="text-xs"
                  >
                    {item.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 md:gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2 line-clamp-1">
                  <IconUsers className="w-4 h-4" />
                  <span className="line-clamp-1">
                    {item.Class.level}
                    {item.Class.section} - {item.subject.department}
                  </span>
                </div>
                {isAssignment && (
                  <div className="flex items-center gap-2 line-clamp-1">
                    <IconCalendar className="w-4 h-4" />
                    <span className="line-clamp-1">
                      Due: {formatDate(item.dueDate)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 line-clamp-1">
                  <IconClock className="w-4 h-4" />
                  <span className="line-clamp-1">
                    Created: {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              {isAssignment && (
                <div className="flex items-center gap-3">
                  <Progress
                    value={
                      (item?.assignmentSubmissions?.length /
                        item?.Class?.students?.length) *
                      100
                    }
                    className="flex-1 h-2"
                  />
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {item?.assignmentSubmissions?.length}/
                    {item?.Class?.students?.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              asChild
              className="w-full lg:w-auto hover:bg-gray-100"
            >
              <Link href={`/t/assignments/${item.slug || item.id}`}>
                <IconEye className="w-4 h-4" />{" "}
                <span className="md:hidden">View</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full lg:w-auto hover:bg-gray-100"
            >
              <IconEdit className="w-4 h-4" />{" "}
              <span className="md:hidden">Edit</span>
            </Button>
            <Button
              variant="outline"
              className="w-full lg:w-auto hover:bg-red-50 text-red-600 hover:text-red-600"
            >
              <IconTrash className="w-4 h-4" />{" "}
              <span className="md:hidden">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Page = () => {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [lessonNotes, setLessonNotes] = useState<Assignment[]>([]);
  const [documents, setDocuments] = useState<Assignment[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId) return;

      try {
        const [allDocuments, assignments, lessonNotes] = await Promise.all([
          teacherService.getTeacherAssignmentsDocuments(
            user?.school?.id!,
            user?.id!
          ),
          teacherService.getTeacherAssignments(user?.school?.id!, user?.id!),
          teacherService.getTeacherLessonNotes(user?.school?.id!, user?.id!),
        ]);

        setDocuments(allDocuments);
        setLessonNotes(lessonNotes);
        setAssignments(assignments);
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
      <PageHeader
        title="Assignments & Lesson Notes"
        description="Create and manage assignments and lesson notes for your classes"
        primaryCTA={{
          icon: IconPlus,
          label: "Create New",
          slug: "/t/assignments/new",
        }}
      />

      <AssignmentsCards
        total={documents.length}
        assignments={assignments.length}
        lessonNotes={lessonNotes.length}
      />

      <SearchBarWrapper placeholder="Search assignments, lesson notes or homeworks" />

      {/* Tabs */}
      <Tabs defaultValue="all">
        <ScrollArea>
          <TabsList className="mb-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="assignments">
              Assignments (
              {assignments.filter((a) => a.type === "ASSIGNMENT").length})
            </TabsTrigger>
            <TabsTrigger value="lesson-notes">
              Lesson Notes ({lessonNotes.length})
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="all" className="space-y-4 mt-6">
          {documents.length === 0 && (
            <NothingFound message="No documents found" />
          )}
          {documents.map((document) => (
            <ItemCard key={document.id} item={document} />
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-6">
          {assignments.length === 0 && (
            <NothingFound message="No assignments found" />
          )}
          {assignments.map((assignment) => (
            <ItemCard key={assignment.id} item={assignment} />
          ))}
        </TabsContent>

        <TabsContent value="lesson-notes" className="space-y-4 mt-6">
          {lessonNotes.length === 0 && (
            <NothingFound message="No notes found" />
          )}
          {lessonNotes.map((note) => (
            <ItemCard key={note.id} item={note} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
