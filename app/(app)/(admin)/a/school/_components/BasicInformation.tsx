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
import {
  IconBell,
  IconBuildings,
  IconEye,
  IconPencil,
  IconPlus,
  IconTarget,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";
import { RequiredAsterisk } from "@/components/RequiredAsterisk";
import {
  SchoolIdentitySchema,
  SchoolIdentitySchemaType,
} from "@/lib/zodSchema";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { years } from "@/constant";
import { useAuth } from "@/store/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/components/Loader";
import api from "@/lib/api";
import { toast } from "sonner";
import { LogoUpload } from "@/components/LogoUpload";
import Image from "next/image";

interface Props {
  schoolTypes: {
    id: string;
    name: string;
  }[];
  ownershipTypes: {
    id: string;
    name: string;
  }[];
}

export const BasicInformation = ({ schoolTypes, ownershipTypes }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateSchool = useAuth((s) => s.updateSchool);
  const [pending, startTransition] = useTransition();
  const [logoPending, startLogoTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const edit = searchParams.get("edit") === "true";

  const form = useForm<SchoolIdentitySchemaType>({
    resolver: zodResolver(SchoolIdentitySchema),
    defaultValues: {
      name: "",
      motto: "",
      acronym: "",
      visionStatement: "",
      missionStatement: "",
      establishmentYear: "",
      ownershipType: "",
      schoolType: "",
    },
  });

  // Reset form when owned school loads
  useEffect(() => {
    if (user?.school) {
      form.reset({
        name: user.school.name || "",
        motto: user.school.motto || "",
        acronym: user.school.acronym || "",
        visionStatement: user.school.visionStatement || "",
        missionStatement: user.school.missionStatement || "",
        establishmentYear: user.school.establishmentYear?.toString() || "",
        ownershipType: user.school.ownershipType || "",
        schoolType: user.school.schoolType || "",
      });
    }
  }, [user?.school, form]);

  function onSubmit(values: SchoolIdentitySchemaType) {
    startTransition(async () => {
      try {
        const res = await api.put(`/schools/${user?.school?.id}`, values);
        updateSchool(res.data.school);
        toast.success(res.data.message);
        router.replace(`/a/school`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    });
  }
  const [logo, setLogo] = useState<string>(user?.school?.logo || "");

  const handleUpload = (croppedImage: string) => {
    setLogo(croppedImage);

    startLogoTransition(async () => {
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
        const res = await api.post(
          `/upload/logo/${user?.school?.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success(res.data.message);
        updateSchool(res.data.school); // ✅ update store
        setLogo(res.data.imageUrl); // ✅ update image preview
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Upload failed");
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <LogoUpload
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpload={(cropped) => {
            setShowModal(false);
            handleUpload(cropped);
          }}
          currentLogo={logo || user?.school?.logo}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-6">
              {/* ==== BASIC INFO SECTION ==== */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-base">School Identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Basic information about your school including name, logo,
                    and branding
                  </p>
                </div>
                <div className="flex flex-col md:flex-row items-start justify-start gap-4">
                  <div className="relative flex-1 w-full">
                    {user?.school?.logo ? (
                      <div className="rounded-md overflow-hidden">
                        <Image
                          src={user.school.logo}
                          alt={`${user.school.name}'s logo`}
                          width={1000}
                          height={1000}
                          className="object-cover size-full aspect-video"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground rounded-md w-full py-10 flex items-center justify-center bg-accent">
                        <IconBuildings className="text-muted-foreground size-14" />
                      </div>
                    )}

                    {edit && (
                      <Button
                        className="absolute text-xs shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 bottom-[-15px] left-[50%] translate-x-[-50%]  "
                        variant={"outline"}
                        size={"sm"}
                        type="button"
                        onClick={() => setShowModal(true)}
                        disabled={logoPending}
                      >
                        {logoPending ? (
                          <Loader text="" />
                        ) : (
                          <>
                            {user?.school?.logo ? (
                              <>
                                <IconPencil size={8} /> Edit
                              </>
                            ) : (
                              <>
                                <IconPlus size={8} /> Add
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex-3 w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SCHOOL NAME */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              School Name <RequiredAsterisk />
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="EduManage School Management"
                                readOnly={!edit}
                                disabled={!edit}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* ACRONYM */}
                      <FormField
                        control={form.control}
                        name="acronym"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Name/Acronym</FormLabel>
                            <FormControl>
                              <Input
                                readOnly={!edit}
                                disabled={!edit}
                                placeholder="EMS"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* MOTTO */}
                    <FormField
                      control={form.control}
                      name="motto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Motto</FormLabel>
                          <FormControl>
                            <Input
                              readOnly={!edit}
                              disabled={!edit}
                              placeholder="Excellence Through Knowledge"
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

              <Separator />

              {/* ==== STATEMENTS ==== */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm flex items-center gap-1">
                    <IconEye className="text-primary inline-block" />
                    <span>Vision Statement</span>
                  </h3>
                  <FormField
                    control={form.control}
                    name="visionStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input readOnly={!edit} disabled={!edit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-sm flex items-center gap-1">
                    <IconTarget className="text-green-500 inline-block" />
                    <span>Mission Statement</span>
                  </h3>
                  <FormField
                    control={form.control}
                    name="missionStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input readOnly={!edit} disabled={!edit} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* ==== DROPDOWNS ==== */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ESTABLISHMENT YEAR */}
                <FormField
                  control={form.control}
                  name="establishmentYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Established</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!edit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SCHOOL TYPE */}
                <FormField
                  control={form.control}
                  name="schoolType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        School Category <RequiredAsterisk />
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!edit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schoolTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* OWNERSHIP TYPE */}
                <FormField
                  control={form.control}
                  name="ownershipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ownership Type <RequiredAsterisk />
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!edit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ownershipTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
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

            {/* ==== SAVE / CANCEL ==== */}
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
