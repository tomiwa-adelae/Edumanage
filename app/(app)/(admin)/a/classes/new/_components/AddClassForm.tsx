"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IconBuilding, IconMapPin2, IconUsers } from "@tabler/icons-react";
import React, { useTransition } from "react";
import { AddClassFormSchema, AddClassFormSchemaType } from "@/lib/zodSchema";
import { toast } from "sonner";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/store/useAuth";
import { Loader } from "@/components/Loader";
import { UserProfilePicture } from "@/components/UserProfilePicture";

interface Props {
  classSections: {
    id: string;
    name: string;
    value: string;
  }[];
  classLevels: {
    id: string;
    name: string;
    value: string;
  }[];
  teachers: User[] | undefined;
  departments: {
    id: string;
    name: string;
    value: string;
  }[];
}

export const AddClassForm = ({
  classSections,
  classLevels,
  teachers,
  departments,
}: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const form = useForm<AddClassFormSchemaType>({
    resolver: zodResolver(AddClassFormSchema),
    defaultValues: {
      level: "",
      section: "",
      department: "",
      description: "",
      teacherId: "",
      capacity: "",
      classRoomNumber: "",
    },
  });

  const selectedLevel = form.watch("level");
  const showDepartment = ["SS1", "SS2", "SS3"].includes(selectedLevel);

  function onSubmit(values: AddClassFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/classes/${user?.school?.schoolID}`,
          values
        );
        toast.success(res.data.message);
        form.reset();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <h3 className="font-medium text-sm flex items-center justify-start gap-1">
              <IconBuilding className="text-primary inline-block" />
              <span>Basic Information</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`grid gap-4 ${
                showDepartment
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {/* Class Level */}
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>
                      Class Level <RequiredAsterisk />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classLevels.map((level) => (
                          <SelectItem value={level.value} key={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section */}
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>
                      Class Section <RequiredAsterisk />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classSections.map((section) => (
                          <SelectItem value={section.value} key={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department (conditionally visible) */}
              {showDepartment && (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem className="col-span-2 lg:col-span-1 transition-all duration-300">
                      <FormLabel>
                        Department <RequiredAsterisk />
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem
                              value={department.name}
                              key={department.id}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description or notes about this class..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-medium text-sm flex items-center justify-start gap-1">
              <IconUsers className="text-primary inline-block" />
              <span>Class Teacher & Capacity</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Class Teacher <RequiredAsterisk />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-left">
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers?.length === 0 && (
                          <span className="italic block text-center text-sm text-muted-foreground py-4">
                            No teachers found
                          </span>
                        )}
                        {teachers?.map((teacher) => (
                          <SelectItem value={teacher?.id!} key={teacher?.id}>
                            <span className="flex items-center gap-2">
                              <UserProfilePicture
                                src={teacher?.image!}
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
                    <FormDescription>
                      Primary teacher responsible for this class
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Maximum Capacity
                      <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 45" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Maximum number of students allowed
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-medium text-sm flex items-center justify-start gap-1">
              <IconMapPin2 className="text-primary inline-block" />
              <span>Classroom Location</span>
            </h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="classRoomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room/Classroom number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Block A, Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Physical location of the classroom
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => router.push("/a/classes")}
            type="button"
            variant="secondary"
            disabled={pending}
          >
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? <Loader text="Creating..." /> : "Create Class"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
