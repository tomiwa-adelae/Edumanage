"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class, useAuth } from "@/store/useAuth";
import { useTransition } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import { DateSelector } from "@/components/DateSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders, relationships } from "@/constant";
import {
  EducationInformationFormSchema,
  EducationInformationFormSchemaType,
} from "@/lib/zodSchema";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";

interface Props {
  classLevels: {
    id: string;
    name: string;
    value: string;
  }[];
  departments: {
    id: string;
    name: string;
  }[];
}

export const DashboardEducationInformationForm = ({
  classLevels,
  departments,
}: Props) => {
  const { user } = useAuth();
  const setUser = useAuth((s) => s.setUser);
  const [pending, startTransition] = useTransition();

  const form = useForm<EducationInformationFormSchemaType>({
    resolver: zodResolver(EducationInformationFormSchema),
    defaultValues: {
      candidateNumber: user?.Student.candidateNumber || "",
      examScore: user?.Student.examScore || "",
      previousSchool: user?.Student.previousSchool || "",
      department: user?.department || "",
      level: user?.Student.desiredClass || "",
    },
  });

  const selectedLevel = form.watch("level");
  const showDepartment = ["SS1", "SS2", "SS3"].includes(selectedLevel);

  function onSubmit(values: EducationInformationFormSchemaType) {
    startTransition(async () => {
      try {
        const payload = {
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          otherName: user?.otherName,
          address: user?.address,
          city: user?.city,
          state: user?.state,
          country: user?.country,
          phoneNumber: user?.phoneNumber,
          title: user?.title,
          dob: user?.dob,
          medicalConditions: user?.medicalConditions,
          image: user?.image,
          candidateNumber: values.candidateNumber,
          examScore: values?.examScore,
          previousSchool: values?.previousSchool,
          department: values?.department,
          level: values?.level,
          parentEmail: user?.Student.ParentStudentLink[0].parent.user?.email,
          parentFirstName:
            user?.Student.ParentStudentLink[0].parent.user?.firstName,
          parentLastName:
            user?.Student.ParentStudentLink[0].parent.user?.lastName,
          parentPhoneNumber:
            user?.Student.ParentStudentLink[0].parent.user?.phoneNumber,
          parentRelationship: user?.Student.ParentStudentLink[0].relation,
        };

        const res = await api.put(
          `/students/${user?.schoolId}/update-profile/${user?.id}`,
          payload
        );
        setUser(res.data.user);
        toast.success(res.data.message);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Educational Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="previousSchool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous School</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter previous school" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="candidateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter candidate number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="examScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam score</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter score" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Class Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classLevels?.length === 0 && (
                          <span className="italic block text-center text-sm text-muted-foreground py-4">
                            No levels found
                          </span>
                        )}
                        {classLevels?.map((level) => (
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
              {showDepartment && (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
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
                          {departments?.length === 0 && (
                            <span className="italic block text-center text-sm text-muted-foreground py-4">
                              No departments found
                            </span>
                          )}
                          {departments?.map((department) => (
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
            <Button className="w-full" disabled={pending}>
              {pending ? <Loader text="Saving..." /> : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
