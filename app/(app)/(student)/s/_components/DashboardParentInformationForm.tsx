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
  ParentInformationFormSchema,
  ParentInformationFormSchemaType,
} from "@/lib/zodSchema";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";

interface Props {
  states: {
    id: string;
    name: string;
  }[];
  classes: Class[];
  countries: {
    id: string;
    name: string;
  }[];
  departments: {
    id: string;
    name: string;
  }[];
}

export const DashboardParentInformationForm = ({
  states,
  classes,
  countries,
  departments,
}: Props) => {
  const { user } = useAuth();
  const setUser = useAuth((s) => s.setUser);
  const [pending, startTransition] = useTransition();

  const form = useForm<ParentInformationFormSchemaType>({
    resolver: zodResolver(ParentInformationFormSchema),
    defaultValues: {
      parentEmail: user?.Student.ParentStudentLink[0].parent.user?.email || "",
      parentFirstName:
        user?.Student.ParentStudentLink[0].parent.user?.firstName || "",
      parentLastName:
        user?.Student.ParentStudentLink[0].parent.user?.lastName || "",
      parentPhoneNumber:
        user?.Student.ParentStudentLink[0].parent.user?.phoneNumber || "",
      parentRelationship: user?.Student.ParentStudentLink[0].relation || "",
    },
  });

  function onSubmit(values: ParentInformationFormSchemaType) {
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
          candidateNumber: user?.Student?.candidateNumber,
          examScore: user?.Student?.examScore,
          previousSchool: user?.Student?.previousSchool,
          department: user?.department,
          parentEmail: values.parentEmail,
          parentFirstName: values.parentFirstName,
          parentLastName: values.parentLastName,
          parentPhoneNumber: values.parentPhoneNumber,
          parentRelationship: values.parentRelationship,
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
        <CardTitle>Parent/Guardian Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="parentFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent first name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter parent email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent phone</FormLabel>
                    <FormControl>
                      <RPNInput.default
                        className="flex rounded-md shadow-xs"
                        international
                        flagComponent={FlagComponent}
                        countrySelectComponent={CountrySelect}
                        inputComponent={PhoneInput}
                        placeholder="+2348012345679"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {relationships.map((relationship, index) => (
                          <SelectItem value={relationship} key={index}>
                            {relationship}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
