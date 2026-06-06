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
import { genders } from "@/constant";
import {
  PersonalInformationFormSchema,
  PersonalInformationFormSchemaType,
} from "@/lib/zodSchema";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

export const DashboardPersonalInformationForm = ({
  states,
  classes,
  countries,
  departments,
}: Props) => {
  const { user } = useAuth();
  const setUser = useAuth((s) => s.setUser);
  const [pending, startTransition] = useTransition();

  const form = useForm<PersonalInformationFormSchemaType>({
    resolver: zodResolver(PersonalInformationFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      otherName: user?.otherName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      gender: user?.gender || "",
      dob: user?.dob || "",
      medicalConditions: user?.medicalConditions || "",
    },
  });

  function onSubmit(values: PersonalInformationFormSchemaType) {
    startTransition(async () => {
      try {
        const payload = {
          email: values?.email,
          firstName: values?.firstName,
          lastName: values?.lastName,
          otherName: values?.otherName,
          address: values?.address,
          city: values?.city,
          state: values?.state,
          country: values?.country,
          phoneNumber: values?.phoneNumber,
          dob: values?.dob,
          medicalConditions: values?.medicalConditions,
          image: user?.image,
          candidateNumber: user?.Student.candidateNumber,
          examScore: user?.Student?.examScore,
          previousSchool: user?.Student?.previousSchool,
          department: user?.department,
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
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="otherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter other name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter student email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Phone</FormLabel>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DateSelector field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genders.map((gender, index) => (
                          <SelectItem value={gender} key={index}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Education Avenue, Lagelu Local Government"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Ibadan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states?.length === 0 && (
                          <span className="italic block text-center text-sm text-muted-foreground py-4">
                            No states found
                          </span>
                        )}
                        {states?.map((state) => (
                          <SelectItem value={state.name} key={state.id}>
                            {state.name}
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries?.length === 0 && (
                          <span className="italic block text-center text-sm text-muted-foreground py-4">
                            No countries found
                          </span>
                        )}
                        {countries?.map((country, index) => (
                          <SelectItem value={country.name} key={index}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="medicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical conditions/allergies</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any medical conditions or allergies (or 'None')"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={pending}>
              {pending ? <Loader text="Saving..." /> : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
