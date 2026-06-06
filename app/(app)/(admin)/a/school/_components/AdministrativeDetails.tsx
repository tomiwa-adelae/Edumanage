"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconAward,
  IconBell,
  IconBuildings,
  IconBulb,
  IconCalendar,
  IconClock,
  IconEye,
  IconMapPin,
  IconPhone,
  IconTarget,
  IconUsers,
} from "@tabler/icons-react";
import React, { useEffect, useTransition } from "react";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  AdministrativeDetailsSchema,
  AdministrativeDetailsSchemaType,
} from "@/lib/zodSchema";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  academicTerms,
  countries,
  gradingSystems,
  ownershipTypes,
  schoolTypes,
  states,
  termsPerSession,
  years,
} from "@/constant";
import { DateSelector } from "@/components/DateSelector";
import { Loader } from "@/components/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";

interface Props {
  teachers: number;
  students: number;
}

export const AdministrativeDetails = ({ teachers, students }: Props) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const edit = searchParams.get("edit") === "true";

  const updateSchool = useAuth((s) => s.updateSchool);
  const { user } = useAuth();

  const [pending, startTransition] = useTransition();

  const form = useForm<AdministrativeDetailsSchemaType>({
    resolver: zodResolver(AdministrativeDetailsSchema),
    defaultValues: {
      accreditationNumber: "",
      accreditationBody: "",
      schoolRegistrationNumber: "",
    },
  });

  // ✅ Load user school data into form
  useEffect(() => {
    if (user?.school) {
      form.reset({
        accreditationNumber: user.school.accreditationNumber || "",
        accreditationBody: user.school.accreditationBody || "",
        schoolRegistrationNumber: user.school.schoolRegistrationNumber || "",
      });
    }
  }, [user?.school, form]);

  function onSubmit(values: AdministrativeDetailsSchemaType) {
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

  const ratio = teachers > 0 ? Math.round(students / teachers) : 0;

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-base">
                    Administrative Details
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registration numbers, accreditation, and regulatory
                    information
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconAward className="text-primary inline-block" />
                    <span>Registration & Licensing</span>
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="schoolRegistrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            School Registration Number
                            <RequiredAsterisk />
                          </FormLabel>
                          <FormControl>
                            <Input
                              readOnly={!edit}
                              disabled={!edit}
                              placeholder="Enter Registration Number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Official registration number issued by education
                            authorities
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                  <IconBulb className="text-green-500 inline-block" />
                  <span>Accreditation Information</span>
                </h3>
                <div className="grid grid-col-1 md:grid-cols-2 gap-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="accreditationBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accreditation Body</FormLabel>
                        <FormControl>
                          <Input
                            readOnly={!edit}
                            disabled={!edit}
                            placeholder="e.g., Ministry of Education"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accreditationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accreditation Number</FormLabel>
                        <FormControl>
                          <Input
                            readOnly={!edit}
                            disabled={!edit}
                            placeholder="Enter accreditation number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                  <IconUsers className="text-purple-500 inline-block" />
                  <span>Additional Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-md py-6 px-4 space-y-1.5">
                    <p className="text-sm text-muted-foreground">
                      Total Capacity
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium">
                      {students} Students
                    </p>
                  </div>
                  <div className="bg-muted rounded-md py-6 px-4 space-y-1.5">
                    <p className="text-sm text-muted-foreground">
                      Teaching Staff
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium">
                      {teachers} Teachers
                    </p>
                  </div>
                  <div className="bg-muted rounded-md py-6 px-4 space-y-1.5">
                    <p className="text-sm text-muted-foreground">
                      Student-Teacher Ratio
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium">
                      {students === 0 ? 0 : 1}:{ratio}
                    </p>
                  </div>
                  <div className="bg-muted rounded-md py-6 px-4 space-y-1.5">
                    <p className="text-sm text-muted-foreground">Campus Size</p>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium">
                      15 Acres
                    </p>
                  </div>
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
