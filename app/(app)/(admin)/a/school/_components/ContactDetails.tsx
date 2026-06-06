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
  IconBell,
  IconBuildings,
  IconClock,
  IconEye,
  IconMapPin,
  IconPhone,
  IconTarget,
} from "@tabler/icons-react";
import React, { useEffect, useTransition } from "react";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  ContactDetailsSchema,
  ContactDetailsSchemaType,
} from "@/lib/zodSchema";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";

interface Props {
  states: {
    id: string;
    name: string;
  }[];
  countries: {
    id: string;
    name: string;
  }[];
}

export const ContactDetails = ({ states, countries }: Props) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const edit = searchParams.get("edit") === "true";

  const updateSchool = useAuth((s) => s.updateSchool);
  const { user } = useAuth();

  const [pending, startTransition] = useTransition();

  const form = useForm<ContactDetailsSchemaType>({
    resolver: zodResolver(ContactDetailsSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      primaryPhone: "",
      alternatePhone: "",
      email: "",
      website: "",
    },
  });

  // ✅ Load user school data into form
  useEffect(() => {
    if (user?.school) {
      form.reset({
        address: user.school.address || "",
        city: user.school.city || "",
        state: user.school.state || "",
        email: user.school.email || "",
        website: user.school.website || "",
        alternatePhone: user.school.alternatePhone || "",
        primaryPhone: user.school.primaryPhone || "",
        postalCode: user.school.postalCode || "",
        country: user.school.country?.toString() || "",
      });
    }
  }, [user?.school, form]);

  function onSubmit(values: ContactDetailsSchemaType) {
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
                  <h3 className="font-medium text-base">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">
                    School address, phone numbers, email, and website details
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                    <IconMapPin className="text-primary inline-block" />
                    <span>Physical Address</span>
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Street Address
                            <RequiredAsterisk />
                          </FormLabel>
                          <FormControl>
                            <Input
                              readOnly={!edit}
                              disabled={!edit}
                              placeholder="123 Education Avenue, Lagelu Local Government"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              City
                              <RequiredAsterisk />
                            </FormLabel>
                            <FormControl>
                              <Input
                                readOnly={!edit}
                                disabled={!edit}
                                placeholder="Ibadan"
                                {...field}
                              />
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
                            <FormLabel>
                              State
                              <RequiredAsterisk />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!edit}
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code </FormLabel>
                            <FormControl>
                              <Input
                                readOnly={!edit}
                                disabled={!edit}
                                placeholder="100001"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Country <RequiredAsterisk />
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!edit}
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
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center justify-start gap-1">
                  <IconPhone className="text-green-500 inline-block" />
                  <span>Communication Details</span>
                </h3>
                <div className="grid grid-col-1 md:grid-cols-2 gap-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Primary Phone
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
                            readOnly={!edit}
                            disabled={!edit}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone</FormLabel>
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
                            readOnly={!edit}
                            disabled={!edit}
                          />
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
                        <FormLabel>
                          Email Address <RequiredAsterisk />{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="info@EMS.com"
                            type="email"
                            readOnly={!edit}
                            disabled={!edit}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="www.EMS.com"
                            readOnly={!edit}
                            disabled={!edit}
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
