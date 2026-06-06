"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  IconCheck,
  IconEdit,
  IconEye,
  IconEyeClosed,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  EditProfileFormSchema,
  EditProfileFormSchemaType,
} from "@/lib/zodSchema";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { useAuth, User } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import * as RPNInput from "react-phone-number-input";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genders, titles, years } from "@/constant";
import { cn, formatWord } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Badge } from "@/components/ui/badge";
import { DateSelector } from "@/components/DateSelector";
import { Textarea } from "@/components/ui/textarea";
import {
  FileWithMeta,
  UploadPhotosModal,
} from "@/components/UploadPhotosModal";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { env } from "@/lib/env";

interface Props {
  user: User;
  states: {
    id: string;
    name: string;
  }[];
  countries: {
    id: string;
    name: string;
  }[];
  departments: {
    id: string;
    name: string;
    value: string;
  }[];
}

export function EditProfileForm({
  user,
  states,
  countries,
  departments,
}: Props) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const setUser = useAuth((s) => s.setUser);

  const [pending, startTransition] = useTransition();
  const [photoPending, startPhotoTransition] = useTransition();

  const form = useForm<EditProfileFormSchemaType>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      dob: user?.dob || "",
      department: user?.department || "",
      emergencyContactName: user?.emergencyContactName || "",
      emergencyPhoneNumber: user?.emergencyPhoneNumber || "",
      employeeID: user?.employeeID || "",
      gender: user?.gender || "",
      image: user?.image || "",
      title: user?.title || "",
      medicalConditions: user?.medicalConditions || "",
    },
  });

  function onSubmit(data: EditProfileFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.put(`/auth/${user?.id}`, {
          ...data,
          image: profilePic || user?.image, // 👈 ensure cropped image is sent
        });
        setUser(res.data.user);
        toast.success(res.data.message);
        router.back();
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    });
  }

  const [profilePic, setProfilePic] = useState<string>("");

  const handleUpload = (croppedImage: string) => {
    setProfilePic(croppedImage);

    startPhotoTransition(async () => {
      // Convert base64 → File
      const byteString = atob(croppedImage.split(",")[1]);
      const mimeString = croppedImage.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "profile-picture.jpg", {
        type: mimeString,
      });

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await api.post(`/upload/profile/${user?.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(res.data.message);
        setUser(res.data.user); // ✅ update store
        setProfilePic(res.data.imageUrl); // ✅ update image preview
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Upload failed");
      }
    });
  };

  return (
    <div className="space-y-6">
      <ProfilePictureUpload
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpload={(cropped) => {
          setShowModal(false);
          handleUpload(cropped);
        }}
        currentImage={profilePic || user?.image}
      />
      <Card>
        <CardContent className="flex items-center justify-start gap-4">
          <div className="relative">
            <UserProfilePicture
              size="lg"
              src={profilePic || user?.image}
              alt={`${user?.firstName}'s picture`}
            />
            <div className="bg-black/20 rounded-full size-full absolute top-0 left-0" />
            <Button
              className="absolute text-xs shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 bottom-[-15px] left-[50%] translate-x-[-50%]  "
              variant={"outline"}
              size={"sm"}
              type="button"
              onClick={() => setShowModal(true)}
              disabled={photoPending}
            >
              {photoPending ? (
                <Loader text="" />
              ) : (
                <>
                  <IconPencil size={8} /> Edit
                </>
              )}
            </Button>
          </div>
          <div className="space-y-1.5">
            <h2 className="font-medium text-2xl md:text-3xl">
              {user?.title} {user?.firstName} {user?.lastName}
            </h2>
            <Badge>{formatWord[user?.role!]}</Badge>
            <a
              href={`mailto:${user?.email}`}
              className="text-muted-foreground text-sm ml-2 hover:text-primary hover:underline"
            >
              {user?.email}
            </a>
          </div>
        </CardContent>
      </Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titles.map((title, index) => (
                          <SelectItem value={title} key={index}>
                            {title}
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First name
                      <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
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
                      <Input placeholder="Enter your last name" {...field} />
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
                      Email Address
                      <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@lagelu.com"
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Your role and employment details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your employee ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Department <RequiredAsterisk />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <FormField
                control={form.control}
                name="joinedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joined Date</FormLabel>
                    <FormControl>
                      <DateSelector field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Your location details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Your emergency contact</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>Your medical details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1">
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
            </CardContent>
          </Card>
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
              {pending ? <Loader text="Saving..." /> : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
