"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradeFormSchema, GradeFormSchemaType } from "@/lib/zodSchema";
import { IconAlertCircle, IconAward, IconX } from "@tabler/icons-react";
import React, { useTransition } from "react";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "@/components/Loader";

interface Props {
  totalMarks: number | undefined;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  submissionId: string | undefined;
}

export const GradeForm = ({
  totalMarks,
  open,
  onClose,
  submissionId,
  onRefresh,
}: Props) => {
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const form = useForm<GradeFormSchemaType>({
    resolver: zodResolver(GradeFormSchema),
    mode: "all", // ✅ Validate only after user leaves the field
    reValidateMode: "onChange", // ✅ Revalidate when field changes to clear old errors
    defaultValues: {
      feedback: "",
      grade: "",
    },
  });

  async function onSubmit(data: GradeFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.patch(
          `/assignment-submissions/${user?.school?.id}/${submissionId}/grade`,
          {
            submissionId: submissionId, // pass this prop from parent
            grade: Number(data.grade),
            feedback: data.feedback,
            gradedById: user?.id,
          }
        );
        toast.success(res.data.message);
        onClose();
        onRefresh();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to grade assignment"
        );
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5 space-y-4">
        <AlertDialogHeader className="flex flex-row items-center justify-between gap-1">
          <AlertDialogTitle>Grade this Submission</AlertDialogTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <IconX />
          </Button>
        </AlertDialogHeader>
        <div className="flex items-start justify-start gap-1 border border-primary p-3 rounded-md text-xs">
          <IconAlertCircle className="text-primary size-6" />
          Enter the score and provide constructive feedback to help the student
          improve.
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Score (out of {totalMarks === 0 ? 100 : totalMarks})
                    <RequiredAsterisk />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter score (0-${
                        totalMarks === 0 ? 100 : totalMarks
                      })`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        "Provide detailed feedback to help the student learn and improve..."
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Be specific about what the student did well and ares for
                    improvement
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Button
                disabled={pending}
                variant={"outline"}
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={pending} type="submit">
                {pending ? <Loader text="Grading..." /> : "Save Grade"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
