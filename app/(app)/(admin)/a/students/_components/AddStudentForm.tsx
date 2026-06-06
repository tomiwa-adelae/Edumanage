"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { NewStudentForm, NewStudentFormType } from "@/lib/zodSchema";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  IconAlertSquareRounded,
  IconBuilding,
  IconClipboardHeart,
  IconMapPin2,
  IconUser,
} from "@tabler/icons-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
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
import { allClasses, genders, relationships, sections } from "@/constant";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Class, useAuth } from "@/store/useAuth";
import { NothingFound } from "@/components/NothingFound";

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

export const AddStudentForm = ({
  states,
  classes,
  countries,
  departments,
}: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const form = useForm<NewStudentFormType>({
    resolver: zodResolver(NewStudentForm),
    defaultValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      email: "",
      phoneNumber: "",
      dob: "",
      gender: "",
      classId: "",
      candidateNumber: "",
      examScore: "",
      address: "",
      city: "",
      country: "",
      state: "",
      parentEmail: "",
      parentLastName: "",
      parentFirstName: "",
      parentPhoneNumber: "",
      parentRelationship: "",
      medicalConditions: "",
    },
  });

  const selectedClassId = form.watch("classId");

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const showDepartment = ["SS1", "SS2", "SS3"].includes(
    selectedClass?.level ?? ""
  );

  function onSubmit(values: NewStudentFormType) {
    const selectedClass = classes.find((c) => c.id === values.classId);
    const seniorLevels = ["SS1", "SS2", "SS3"];

    if (
      selectedClass &&
      seniorLevels.includes(selectedClass.level) &&
      !values.department
    ) {
      toast.error("Department is required for SS1, SS2, or SS3 levels");
      return;
    }

    startTransition(async () => {
      try {
        const res = await api.post(`/students/${user?.school?.id}`, values);
        toast.success(res.data.message);
        form.reset();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-6">
              {/* ==== BASIC INFO SECTION ==== */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-base">Student Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the student's personal details
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconUser className="text-primary inline-block" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            First name
                            <RequiredAsterisk />
                          </FormLabel>
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
                          <FormLabel>
                            Last name
                            <RequiredAsterisk />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="otherName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2 lg:col-span-1">
                          <FormLabel>
                            Other name
                            <RequiredAsterisk />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter other name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email
                            <RequiredAsterisk />
                          </FormLabel>
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
                    />
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>{" "}
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconBuilding className="text-primary inline-block" />
                    <span>Academic Information</span>
                  </h3>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous School</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter previous school"
                              {...field}
                            />
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
                          <FormLabel>
                            Candidate Number
                            <RequiredAsterisk />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter candidate number"
                              {...field}
                            />
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
                          <FormLabel>
                            Exam score
                            <RequiredAsterisk />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter score" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Class
                            <RequiredAsterisk />
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.length === 0 && (
                                <span className="italic block text-center text-sm text-muted-foreground py-4">
                                  No classes found
                                </span>
                              )}
                              {classes.map((c) => (
                                <SelectItem value={c.id} key={c.id}>
                                  {c.level}
                                  {c.section}{" "}
                                  {c.department ? `(${c.department})` : ""}
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
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconMapPin2 className="text-primary inline-block" />
                    <span>Address Information</span>
                  </h3>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {states.map((state) => (
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
                              {countries.map((country, index) => (
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
                </div>{" "}
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconUser className="text-primary inline-block" />
                    <span>Parent/Guardian Information</span>
                  </h3>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>{" "}
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconClipboardHeart className="text-primary inline-block" />
                    <span>Medical Information</span>
                  </h3>
                  <div className="space-y-4">
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
                  </div>
                </div>
                <Separator />
                {/* ==== SAVE / CANCEL ==== */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={() => router.push("/a/school")}
                    type="button"
                    variant="secondary"
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? <Loader text="Adding..." /> : "Add student"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
