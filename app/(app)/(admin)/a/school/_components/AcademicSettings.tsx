"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { IconAward, IconBell, IconCalendar } from "@tabler/icons-react";
import React, { useEffect, useTransition } from "react";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  AcademicSettingsSchema,
  AcademicSettingsSchemaType,
} from "@/lib/zodSchema";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { academicTerms, gradingSystems, termsPerSession } from "@/constant";
import { DateSelector } from "@/components/DateSelector";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader } from "@/components/Loader";

export const AcademicSettings = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const edit = searchParams.get("edit") === "true";

  const updateSchool = useAuth((s) => s.updateSchool);
  const { user } = useAuth();

  const [pending, startTransition] = useTransition();

  const form = useForm<AcademicSettingsSchemaType>({
    resolver: zodResolver(AcademicSettingsSchema),
    defaultValues: {
      currentSession: "",
      currentTerm: "",
      termsPerSession: "",
      gradingSystem: "",
      passMark: "",
      academicEndDate: "",
      academicStartDate: "",
    },
  });

  // ✅ Load user school data into form
  useEffect(() => {
    if (user?.school) {
      form.reset({
        currentSession: user.school.currentSession || "",
        termsPerSession: user.school.termsPerSession || "",
        academicEndDate: user.school.academicEndDate || "",
        academicStartDate: user.school.academicStartDate || "",
        currentTerm: user.school.currentTerm || "",
        gradingSystem: user.school.gradingSystem || "",
        passMark: user.school.passMark || "",
      });
    }
  }, [user?.school, form]);

  function onSubmit(values: AcademicSettingsSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.put(`/schools/${user?.school?.id}`, values);
        updateSchool(res.data.school);
        toast.success(res.data.message);
        router.replace(`/a/school`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-base">
                    Academic Configuration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure academic year, terms, grading system, and
                    assessment settings
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconCalendar className="text-primary inline-block" />
                    <span>Current Academic Period</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="currentSession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Current Session
                              <RequiredAsterisk />
                            </FormLabel>
                            <FormControl>
                              <Input
                                readOnly={!edit}
                                disabled={!edit}
                                placeholder="e.g., 2025/2026"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentTerm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Current Term
                              <RequiredAsterisk />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!edit}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {academicTerms.map((term) => (
                                  <SelectItem value={term} key={term}>
                                    {term}
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
                        name="termsPerSession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Terms Per Session
                              <RequiredAsterisk />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!edit}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select terms" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {termsPerSession.map((term) => (
                                  <SelectItem value={term} key={term}>
                                    {term}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="academicStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year Start Date</FormLabel>
                            <FormControl>
                              <DateSelector field={field} disabled={!edit} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="academicEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Academic Year End Date</FormLabel>
                            <FormControl>
                              <DateSelector field={field} disabled={!edit} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                  <IconAward className="text-green-500 inline-block" />
                  <span>Grading & Assessment</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gradingSystem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Grading System
                          <RequiredAsterisk />
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!edit}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {gradingSystems.map((system) => (
                              <SelectItem value={system} key={system}>
                                {system}
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
                    name="passMark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Pass Mark <RequiredAsterisk />
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly={!edit}
                            disabled={!edit}
                            placeholder="e.g., 50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {edit && (
              <div className="border bg-primary/10 rounded-md border-primary text-base text-primary p-6 flex items-center justify-between gap-1">
                <div className="flex items-center justify-start gap-1">
                  <IconBell />
                  <p>You have unsaved changes</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={() => router.push("/a/school")}
                    type="button"
                    variant="secondary"
                    disabled={pending || !edit}
                  >
                    Cancel
                  </Button>
                  <Button disabled={pending || !edit} type="submit">
                    {pending ? <Loader text="Saving..." /> : "Save changes"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
