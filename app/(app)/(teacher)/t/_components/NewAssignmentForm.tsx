"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader } from "@/components/Loader";
import {
  NewAssignmentFormSchema,
  NewAssignmentFormSchemaType,
} from "@/lib/zodSchema";
import api from "@/lib/api";
import { Class, useAuth } from "@/store/useAuth";
import z from "zod";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateSelector } from "@/components/DateSelector";
import { UploadFilesModal } from "@/components/UploadFilesModal";
import { Label } from "react-aria-components";
import {
  IconCheck,
  IconFileDescription,
  IconPlayerPauseFilled,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { Subject } from "@/app/(app)/(admin)/a/subjects/page";

interface Props {
  classes: Class[] | undefined;
  subjects: Subject[];
}

export const NewAssignmentForm = ({ classes, subjects }: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const form = useForm<z.infer<typeof NewAssignmentFormSchema>>({
    resolver: zodResolver(NewAssignmentFormSchema),
    defaultValues: {
      type: "ASSIGNMENT",
      title: "",
      description: "",
      instructions: "",
      classId: "",
      due: "",
      subjectId: "",
      totalMarks: "0",
    },
  });

  const type = form.watch("type");

  async function onSubmit(values: NewAssignmentFormSchemaType) {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);
        {
          values.totalMarks && formData.append("totalMarks", values.totalMarks);
        }
        formData.append("type", values.type);
        formData.append("classId", values.classId);
        formData.append("subjectId", values.subjectId);
        {
          values.due && formData.append("dueDate", values.due);
        }
        formData.append("teacherId", user?.id || ""); // adjust if stored differently
        formData.append("schoolId", user?.school?.id || "");

        values.instructions &&
          formData.append("instructions", values?.instructions);

        // Append all selected files
        if (values.attachments && values.attachments.length > 0) {
          for (const file of values.attachments) {
            formData.append("attachments", file);
          }
        }

        const res = await api.post(
          `/assignments/${user?.school?.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success(res.data.message);
        form.reset();
        setUploadedFiles([]);
        // router.push("/assignments"); // or wherever you want to go
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }

  function togglePause(id: string) {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, paused: !file.paused } : file
      )
    );
  }

  function removeFile(id: string) {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    form.setValue(
      "attachments",
      uploadedFiles
        .filter((file) => file.id !== id)
        .map((f) => new File([], f.name)) // optional, to sync with form
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Assignment Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Type <RequiredAsterisk />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                  <SelectItem value="LESSON-NOTE">Lesson note</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title
                <RequiredAsterisk />
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
                <RequiredAsterisk />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide detailed instructions..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes?.length === 0 && (
                      <span className="italic block text-center text-sm text-muted-foreground py-4">
                        No classes found
                      </span>
                    )}
                    {classes?.map((c) => (
                      <SelectItem value={c.id} key={c.id}>
                        {c.level}
                        {c.section} {c.department ? `(${c.department})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.length === 0 && (
                      <span className="italic block text-center text-sm text-muted-foreground py-4">
                        No subjects found
                      </span>
                    )}
                    {subjects?.map((subject: any) => (
                      <SelectItem
                        value={subject.Subject.id}
                        key={subject.Subject.id}
                      >
                        {subject.Subject.name} ({subject.Subject.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {type === "ASSIGNMENT" && (
          <FormField
            control={form.control}
            name="totalMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Total Marks
                  <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter total score" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === "ASSIGNMENT" && (
          <FormField
            control={form.control}
            name="due"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Due Date <RequiredAsterisk />
                </FormLabel>
                <FormControl>
                  <DateSelector field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col">
          <Label>Attachments (Optionals)</Label>
          <Button
            type="button"
            onClick={() => setOpenModal(true)}
            variant={"outline"}
            className="w-full bg-muted mt-2"
          >
            Upload documents
          </Button>

          {/* File preview display */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-md"
                >
                  <div className="size-10 rounded-md overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                    {file.isImage && file.preview ? (
                      <Image
                        src={file.preview}
                        alt={file.name}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IconFileDescription size={24} className="text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium flex-1 line-clamp-1 w-full">
                        {file.name}
                      </p>
                      <span className="text-xs text-muted-foreground line-clamp-1 ml-2 flex items-center gap-1">
                        <span className="text-primary font-medium">
                          {file.type}
                        </span>{" "}
                        · {file.size}
                      </span>
                    </div>
                    <Progress value={file.progress} className="h-1" />
                    {file.progress < 100 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(file.progress)}%
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === "completed" ? (
                      <div className="hidden w-8 h-8 bg-green-100 rounded md:flex items-center justify-center">
                        <IconCheck size={16} className="text-green-600" />
                      </div>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => togglePause(file.id)}
                        className="hover:bg-gray-200 hidden md:flex"
                      >
                        {file.paused ? (
                          <IconPlayerPlay
                            size={16}
                            className="text-muted-foreground hidden md:flex"
                          />
                        ) : (
                          <IconPlayerPauseFilled
                            size={16}
                            className="text-muted-foreground hidden md:flex"
                          />
                        )}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                      className="hover:bg-red-50"
                    >
                      <IconX size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            onClick={() => router.back()}
            type="button"
            variant="secondary"
            disabled={pending}
          >
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? <Loader text="Creating..." /> : "Create"}
          </Button>
        </div>
      </form>
      {openModal && (
        <UploadFilesModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onImport={(docs) => {
            // Extract real files
            const files = docs.map((d: any) =>
              d.file instanceof File ? d.file : d.file.file
            );

            // Update form
            form.setValue("attachments", files);

            // Update preview UI
            setUploadedFiles(
              docs.map((d: any) => ({
                id: d.id || crypto.randomUUID(),
                name: d.file.name,
                size: `${(d.file.size / 1024).toFixed(1)} KB`,
                type: d.file.type || "document",
                isImage: d.file.type.startsWith("image/"),
                preview: d.preview || URL.createObjectURL(d.file),
                progress: 100, // or 0 if you want to simulate upload progress
                status: "completed",
              }))
            );

            setOpenModal(false);
          }}
        />
      )}
    </Form>
  );
};
