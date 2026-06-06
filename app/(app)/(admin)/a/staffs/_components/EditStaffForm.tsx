"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { NewStaffForm, NewStaffFormType } from "@/lib/zodSchema";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  IconAlertSquareRounded,
  IconBuilding,
  IconClipboardHeart,
  IconMapPin2,
  IconPencil,
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
import { useAuth, User } from "@/store/useAuth";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Badge } from "@/components/ui/badge";

interface Props {
  states: {
    id: string;
    name: string;
  }[];
  countries: {
    id: string;
    name: string;
  }[];
  jobRoles: {
    id: string;
    name: string;
  }[];

  staff: User | undefined;
}

export const EditStaffForm = ({
  states,
  jobRoles,
  countries,
  staff,
}: Props) => {
  const router = useRouter();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const [pending, startTransition] = useTransition();
  const [photoPending, startPhotoTransition] = useTransition();

  const form = useForm<NewStaffFormType>({
    resolver: zodResolver(NewStaffForm),
    defaultValues: {
      firstName: staff?.firstName || "",
      lastName: staff?.lastName || "",
      email: staff?.email || "",
      phoneNumber: staff?.phoneNumber || "",
      dob: staff?.dob || "",
      gender: staff?.gender || "",
      address: staff?.address || "",
      city: staff?.city || "",
      state: staff?.state || "",
      country: staff?.country || "",
      emergencyContactName: staff?.emergencyContactName || "",
      emergencyPhoneNumber: staff?.emergencyPhoneNumber || "",
      medicalConditions: staff?.medicalConditions || "",
      role: staff?.role || "",
    },
  });

  function onSubmit(values: NewStaffFormType) {
    startTransition(async () => {
      try {
        const res = await api.put(
          `/schools/${user?.school?.id}/update-profile/${staff?.id}`,
          values
        );
        toast.success(res.data.message);
        router.push(`/a/staffs/${res.data.user.username}`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
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
        const res = await api.post(`/upload/profile/${staff?.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success(res.data.message);
        setProfilePic(res.data.imageUrl); // ✅ update image preview
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Upload failed");
      }
    });
  };

  return (
    <>
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
              src={profilePic || staff?.image}
              alt={`${staff?.firstName}'s picture`}
            />
            <div className="bg-black/20 rounded-full size-full absolute top-0 left-0" />
            <Button
              className="absolute text-xs shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10 bottom-[-15px] left-[50%] translate-x-[-50%]  "
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
              {staff?.firstName} {staff?.lastName}
            </h2>
            <Badge>{formatWord[staff?.role!]}</Badge>
            <a
              href={`mailto:${staff?.email}`}
              className="text-muted-foreground text-sm ml-2 hover:text-primary hover:underline"
            >
              {staff?.email}
            </a>
          </div>
        </CardContent>
      </Card>
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
                              <Input
                                placeholder="Enter first name"
                                {...field}
                              />
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
                                    <SelectItem
                                      value={state.name}
                                      key={state.id}
                                    >
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
                      onClick={() => router.push("/a/school")}
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
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
