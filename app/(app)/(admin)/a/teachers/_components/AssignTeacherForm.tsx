"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
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
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Loader } from "@/components/Loader";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import {
  AssignTeacherFormSchema,
  AssignTeacherFormSchemaType,
} from "@/lib/zodSchema";
import api from "@/lib/api";
import { Class, useAuth, User } from "@/store/useAuth";
import { Subject } from "../../subjects/page";
import z from "zod";

interface Props {
  teachers: User[];
  classes: Class[];
  subjects: Subject[];
}

export const AssignTeacherForm = ({ teachers, classes, subjects }: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AssignTeacherFormSchema>>({
    resolver: zodResolver(AssignTeacherFormSchema),
    defaultValues: {
      type: "CLASS",
      teacher: "",
      class: "",
      subjects: [],
    },
  });

  const type = form.watch("type");

  async function onSubmit(values: AssignTeacherFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/schools/${user?.school?.schoolID}/assign-teachers`,
          values
        );
        toast.success(res.data.message);
        form.reset();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }

  const subjectOptions: Option[] =
    subjects?.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.department})`,
    })) ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Assignment Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CLASS">Class Teacher</SelectItem>
                  <SelectItem value="SUBJECT">Subject Teacher</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Teacher */}
        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Teacher</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="text-left">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.length === 0 && (
                    <span className="italic block text-center text-sm text-muted-foreground py-4">
                      No teachers found
                    </span>
                  )}
                  {teachers?.map((teacher) => (
                    <SelectItem value={teacher?.id!} key={teacher?.id}>
                      <span className="flex items-center gap-2">
                        <UserProfilePicture
                          src={teacher?.image}
                          alt={`${teacher?.firstName}'s picture`}
                          size="sm"
                        />
                        <span>
                          <span className="block font-medium">
                            {teacher?.firstName} {teacher?.lastName}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {teacher?.email}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Class + Multiple Subjects for CLASS TYPE */}
        {type === "CLASS" && (
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Class</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes?.map((c) => (
                      <SelectItem value={c.id} key={c.id}>
                        {c.level}
                        {c.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects Taught</FormLabel>
              <MultipleSelector
                defaultOptions={subjectOptions}
                placeholder="Select subjects"
                value={subjectOptions.filter((opt) =>
                  field?.value?.includes(opt.value)
                )}
                onChange={(selected) => {
                  field.onChange(selected.map((s) => s.value));
                }}
                emptyIndicator={
                  <p className="text-center text-sm text-muted-foreground">
                    No subjects found
                  </p>
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

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
            {pending ? <Loader text="Assigning..." /> : "Assign Teacher"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
