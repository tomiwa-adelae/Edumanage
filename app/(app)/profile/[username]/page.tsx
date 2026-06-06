"use client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatDate, formatPhoneNumber, formatWord } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import {
  IconBuilding,
  IconCalendar,
  IconClipboardHeart,
  IconHash,
  IconMail,
  IconMapPin,
  IconMapPin2,
  IconPhone,
  IconUser,
  IconUserEdit,
} from "@tabler/icons-react";
import { Shield } from "lucide-react";
import React from "react";

const page = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile"
        description="Manage your personal information and account settings"
        primaryCTA={{
          label: "Edit profile",
          slug: `/profile/${user?.username}/edit`,
          icon: IconUserEdit,
        }}
      />
      <Card>
        <CardContent className="flex items-center justify-start gap-4">
          <UserProfilePicture
            size="lg"
            src={user?.image}
            alt={`${user?.firstName}'s picture`}
          />
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
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Title</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconUser size={16} className="text-muted-foreground" />
              <span>
                {user?.title !== undefined ? (
                  user?.title
                ) : (
                  <span className="italic text-muted">No title selected</span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">First Name</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconUser size={16} className="text-muted-foreground" />
              <span>{user?.firstName}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Name</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconUser size={16} className="text-muted-foreground" />
              <span>{user?.lastName}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Email Address</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconMail size={16} className="text-muted-foreground" />
              <span>{user?.email}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Phone Number</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconPhone size={16} className="text-muted-foreground" />
              <span>
                {formatPhoneNumber(user?.phoneNumber) || (
                  <span className="italic text-muted-foreground">No phone</span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Date of Birth</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconCalendar size={16} className="text-muted-foreground" />
              <span>
                {formatDate(user?.dob) || (
                  <span className="italic text-muted-foreground">
                    No date of birth
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Gender</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconUser size={16} className="text-muted-foreground" />
              <span>
                {user?.gender || (
                  <span className="italic text-muted-foreground">
                    No gender selected
                  </span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Your role and employment details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Role</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <Shield size={16} className="text-muted-foreground" />
              <span>{formatWord[user?.role!]}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Department</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconBuilding size={16} className="text-muted-foreground" />
              <span>
                {user?.department || (
                  <span className="italic text-muted-foreground">
                    No department
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Employee ID</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconHash size={16} className="text-muted-foreground" />
              <span>
                {user?.employeeID || (
                  <span className="italic text-muted-foreground">
                    No employee ID
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-sm font-medium">Join Date</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconPhone size={16} className="text-muted-foreground" />
              <span>{formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Your location details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Street Address</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconMapPin size={16} className="text-muted-foreground" />
              <span>
                {user?.address ? (
                  user?.address
                ) : (
                  <span className="italic text-muted-foreground">
                    No address
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">City</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconMapPin size={16} className="text-muted-foreground" />
              <span>
                {user?.city ? (
                  user?.city
                ) : (
                  <span className="italic text-muted-foreground">No city</span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">State</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconMapPin size={16} className="text-muted-foreground" />
              <span>
                {user?.state ? (
                  user?.state
                ) : (
                  <span className="italic text-muted-foreground">No state</span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Country</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconMapPin size={16} className="text-muted-foreground" />
              <span>
                {user?.country ? (
                  user?.country
                ) : (
                  <span className="italic text-muted-foreground">
                    No country
                  </span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Your emergency contact</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Emergency Name</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconUser size={16} className="text-muted-foreground" />
              <span>
                {user?.emergencyContactName ? (
                  user?.emergencyContactName
                ) : (
                  <span className="italic text-muted-foreground">
                    No emergency name
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Emergency Phone</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconPhone size={16} className="text-muted-foreground" />
              <span>
                {user?.emergencyPhoneNumber ? (
                  user?.emergencyPhoneNumber
                ) : (
                  <span className="italic text-muted-foreground">
                    No emergency phone
                  </span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>Your medical details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1">
          <div className="space-y-1">
            <p className="text-sm font-medium">Medical Conditions</p>
            <div className="bg-muted p-3 flex items-center justify-start gap-2 text-sm rounded-md">
              <IconClipboardHeart size={16} className="text-muted-foreground" />
              <span>
                {user?.medicalConditions ? (
                  user?.medicalConditions
                ) : (
                  <span className="italic text-muted-foreground">
                    No medical conditions
                  </span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
