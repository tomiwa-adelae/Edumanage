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
import { IconBook, IconFileDescription, IconUsers } from "@tabler/icons-react";
import React, { useTransition } from "react";
import {
  AddSubjectFormSchema,
  AddSubjectFormSchemaType,
} from "@/lib/zodSchema";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  departments: {
    id: string;
    name: string;
    value: string;
  }[];
  classLevels: {
    id: string;
    name: string;
    value: string;
  }[];
}

export const AddSubjectForm = ({ departments, classLevels }: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const form = useForm<AddSubjectFormSchemaType>({
    resolver: zodResolver(AddSubjectFormSchema),
    defaultValues: {
      name: "",
      department: "",
      description: "",
      hoursPerWeek: "",
      passScore: "",
      classes: [],
      isCore: true,
    },
  });

  const selectedClasses = form.watch("classes") || [];
  const seniorLevels = ["SS1", "SS2", "SS3"];

  // showDepartment will be true if any selected class is a senior level
  const showDepartment = selectedClasses.some((cls) =>
    seniorLevels.includes(cls)
  );

  function onSubmit(values: AddSubjectFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/subjects/${user?.school?.schoolID}`,
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
              <IconBook className="text-primary inline-block" />
              <span>Basic Information</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`grid gap-4 ${
                showDepartment ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subject Name <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showDepartment && (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the subject description or notes about this class..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isCore"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      This is a core subject (compulsory for all students)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-medium text-sm flex items-center justify-start gap-1">
              <IconFileDescription className="text-primary inline-block" />
              <span>Academic Configuration</span>
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hoursPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Hours per Week <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Teaching hours allocated per week
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Minimum Pass Score (%)
                      <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>Maximum score to pass</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-medium text-sm flex items-center justify-start gap-1">
              <IconUsers className="text-primary inline-block" />
              <span>Applicable Class Levels *</span>
            </h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="classes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select the class levels where this subject will be taught{" "}
                    <RequiredAsterisk />
                  </FormLabel>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {classLevels.map((level) => {
                      const checked = field.value.includes(level.value);
                      return (
                        <div key={level.id} className="flex items-center gap-2">
                          <Checkbox
                            id={level.value}
                            checked={checked}
                            onCheckedChange={(c) => {
                              if (c) {
                                field.onChange([...field.value, level.value]);
                              } else {
                                field.onChange(
                                  field.value.filter((v) => v !== level.value)
                                );
                              }
                            }}
                          />
                          <FormLabel
                            htmlFor={level.value}
                            className="font-normal"
                          >
                            {level.value}
                          </FormLabel>
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => router.back()}
            type="button"
            variant="secondary"
            disabled={pending}
          >
            Cancel
          </Button>
          <Button disabled={pending} type="submit">
            {pending ? <Loader text="Creating..." /> : "Create Subject"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
