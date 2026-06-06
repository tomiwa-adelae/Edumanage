"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { NewStaffForm, NewStaffFormType } from "@/lib/zodSchema";
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
import { formatWord } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";

interface Props {
  states: {
    id: string;
    name: string;
  }[];
  jobRoles: {
    id: string;
    name: string;
  }[];
  countries: {
    id: string;
    name: string;
  }[];
}

export const AddStaffForm = ({ states, jobRoles, countries }: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const form = useForm<NewStaffFormType>({
    resolver: zodResolver(NewStaffForm),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dob: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      country: "",
      emergencyContactName: "",
      emergencyPhoneNumber: "",
      medicalConditions: "",
      role: "",
    },
  });

  function onSubmit(values: NewStaffFormType) {
    startTransition(async () => {
      try {
        const res = await api.post(
          `/schools/${user?.school?.schoolID}/staff`,
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
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-6">
              {/* ==== BASIC INFO SECTION ==== */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-base">Staff Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the staff's personal details
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconUser className="text-primary inline-block" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              placeholder="Enter staff email"
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
                          <FormLabel>
                            Phone number
                            <RequiredAsterisk />
                          </FormLabel>
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
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job role
                          <RequiredAsterisk />
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobRoles.map((role, index) => (
                              <SelectItem value={role.name} key={index}>
                                {formatWord[role.name]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconMapPin2 className="text-primary inline-block" />
                    <span>Address Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    value={country.name}
                                    key={country.id}
                                  >
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
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconAlertSquareRounded className="text-primary inline-block" />
                    <span>Emergency Contact</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency phone</FormLabel>
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
                    onClick={() => router.back()}
                    type="button"
                    variant="secondary"
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                  <Button disabled={pending} type="submit">
                    {pending ? <Loader text="Adding..." /> : "Add staff"}
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
