"use client";
import { AssignmentAttachment } from "@/components/AssignmentAttachment";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { studentService } from "@/lib/student";
import { cn, formatDate } from "@/lib/utils";
import { Assignment, useAuth } from "@/store/useAuth";
import {
  IconAlertCircle,
  IconBook,
  IconBookmark,
  IconCalendar,
  IconClock,
  IconDownload,
  IconFileDescription,
  IconMail,
  IconPaperclip,
  IconPrinter,
  IconUser,
} from "@tabler/icons-react";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const { user } = useAuth();
  const { slug } = useParams();

  const [lessonNote, setLessonNote] = useState<Assignment>();
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.schoolId || !slug) return;

      try {
        const [lesson] = await Promise.all([
          studentService.getStudentAssignmentsDetails(
            user?.school?.id!,
            user.id,
            slug
          ),
        ]);

        setLessonNote(lesson);
        // Check if lesson is bookmarked
        setIsBookmarked(lesson?.isBookmarked || false);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user, slug]);

  const handleBookmark = async () => {
    try {
      // Toggle bookmark API call here
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
      );
    } catch (error: any) {
      toast.error("Failed to update bookmark");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader />;

  if (!lessonNote) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>{lessonNote?.title}</span>
          </div>
        }
        back
        description={
          <p className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 text-xs sm:text-sm md:text-base">
            <div className="flex items-center justify-start gap-2">
              <IconBook className="size-4" />
              <span>{lessonNote?.subject.name}</span>
            </div>
            <div className="flex items-center justify-start gap-2">
              <IconUser className="size-4" />
              <span>
                {lessonNote?.Teacher.user?.title}{" "}
                {lessonNote?.Teacher.user?.firstName}{" "}
                {lessonNote?.Teacher?.user?.lastName}
              </span>
            </div>
            <div className="flex items-center justify-start gap-2">
              <IconMail className="size-4" />
              <a
                className="hover:underline hover:text-primary"
                href={`mailto:${lessonNote?.Teacher.user?.email}`}
              >
                {lessonNote?.Teacher.user?.email}
              </a>
            </div>
          </p>
        }
      />

      <Separator />

      {/* Quick Actions */}
      {/* <div className="flex flex-wrap gap-2">
        <Button
          variant={isBookmarked ? "default" : "outline"}
          size="sm"
          onClick={handleBookmark}
          className="gap-2"
        >
          <IconBookmark
            className={cn("size-4", isBookmarked && "fill-current")}
          />
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="gap-2"
        >
          <IconPrinter className="size-4" />
          Print
        </Button>
        {lessonNote?.attachments.length > 0 && (
          <Button variant="outline" size="sm" className="gap-2">
            <IconDownload className="size-4" />
            Download All
          </Button>
        )}
      </div> */}

      {/* Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 text-xs gap-2">
        <div className="space-y-2 rounded-md p-4 border">
          <p className="flex items-center justify-start gap-1">
            <IconCalendar className="size-4 text-primary" />
            <span className="text-muted-foreground">Published</span>
          </p>
          <p className="text-primary">{formatDate(lessonNote?.createdAt)}</p>
        </div>
        <div className="space-y-2 rounded-md p-4 border">
          <p className="flex items-center justify-start gap-1">
            <IconClock className="size-4 text-primary" />
            <span className="text-muted-foreground">Last Updated</span>
          </p>
          <p className="text-primary">{formatDate(lessonNote?.createdAt)}</p>
        </div>
        <div className="space-y-2 rounded-md p-4 border">
          <p className="flex items-center justify-start gap-1">
            <IconBook className="size-4 text-primary" />
            <span className="text-muted-foreground">Class</span>
          </p>
          <p className="text-primary">
            {lessonNote?.Class?.level}
            {lessonNote?.Class?.section} {lessonNote?.Class?.department}
          </p>
        </div>
        <div className="space-y-2 rounded-md p-4 border">
          <p className="flex items-center justify-start gap-1">
            <IconPaperclip className="size-4 text-primary" />
            <span className="text-muted-foreground">Attachments</span>
          </p>
          <p className="text-primary">{lessonNote?.attachments.length} files</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="grid gap-4">
            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconBook className="size-4 text-primary" />
                  Lesson description
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                {lessonNote?.description}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconAlertCircle className="size-4 text-primary" />
                  Lesson Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground">
                {lessonNote?.instructions ? (
                  <RenderDescription json={lessonNote?.instructions} />
                ) : (
                  <span className="italic">No instructions given</span>
                )}
              </CardContent>
            </Card>
            {/* Attachments */}
            {lessonNote?.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconPaperclip className="size-4 text-primary" />
                    Lesson Materials
                    <Badge variant="secondary">
                      {lessonNote?.attachments.length} files
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Additional resources and materials for this lesson
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-base space-y-2 text-muted-foreground">
                  {lessonNote?.attachments.map((attachment) => (
                    <AssignmentAttachment
                      key={attachment.id}
                      attachment={attachment}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {/* Teacher Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconUser className="size-4 text-primary" />
                  About the Teacher
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground space-y-4">
                <div className="space-y-2">
                  <p className="flex items-center justify-start gap-2">
                    <IconUser className="size-4" />
                    <span>
                      {lessonNote?.Teacher.user?.title}{" "}
                      {lessonNote?.Teacher.user?.firstName}{" "}
                      {lessonNote?.Teacher.user?.lastName}
                    </span>
                  </p>
                  <a
                    href={`mailto:${lessonNote?.Teacher.user?.email}`}
                    className="flex items-center justify-start gap-2 hover:underline text-primary"
                  >
                    <IconMail className="size-4" />
                    <span>{lessonNote?.Teacher.user?.email}</span>
                  </a>
                </div>
                <Button className="w-full" asChild variant="outline">
                  <a href={`mailto:${lessonNote?.Teacher.user?.email}`}>
                    Ask a Question
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconBook className="size-4" />
                  Study Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Review the key terms and definitions</li>
                  <li>Download materials for offline study</li>
                  <li>Take notes while reading</li>
                  <li>Ask your teacher if you need clarification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
