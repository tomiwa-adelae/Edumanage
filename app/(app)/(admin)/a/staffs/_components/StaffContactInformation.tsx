import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPhoneNumber } from "@/lib/utils";
import {
  IconMail,
  IconMapPin2,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  email: string;
  phoneNumber: string | null;
  address: string | null;
  emergencyPhoneNumber: string | null;
  emergencyContactName: string | null;
}

export const StaffContactInformation = ({
  email,
  phoneNumber,
  address,
  emergencyPhoneNumber,
  emergencyContactName,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 text-muted-foreground text-sm">
        <div className="flex items-start justify-start gap-2">
          <IconMail className="size-5" />
          <p className="text-black dark:text-white font-medium">
            {email ? (
              <a
                className="hover:underline hover:text-primary"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ) : (
              <span className="italic">No email</span>
            )}
          </p>
        </div>
        <div className="flex items-start justify-start gap-2">
          <IconPhone className="size-5" />
          <p className="text-black dark:text-white font-medium">
            {phoneNumber ? (
              <a
                className="hover:underline hover:text-primary"
                href={`tel:${phoneNumber}`}
              >
                {formatPhoneNumber(phoneNumber)}
              </a>
            ) : (
              <span className="italic">No phone</span>
            )}
          </p>
        </div>
        <div className="flex items-start justify-start gap-2">
          <IconMapPin2 className="size-5" />
          <p className="text-black dark:text-white font-medium">
            {address ? (
              <p>{address}</p>
            ) : (
              <span className="italic">No address</span>
            )}
          </p>
        </div>
        <Separator />
        <p className="text-xs">Emergency Contact</p>
        <div className="flex items-start justify-start gap-2">
          <IconUser className="size-5" />
          <p className="text-black dark:text-white font-medium">
            {emergencyContactName ? (
              emergencyContactName
            ) : (
              <span className="italic">No emergency contact</span>
            )}
          </p>
        </div>
        <div className="flex items-start justify-start gap-2">
          <IconPhone className="size-5" />
          <p className="text-black dark:text-white font-medium">
            {emergencyPhoneNumber ? (
              <a
                className="hover:underline hover:text-primary"
                href={`tel:${emergencyPhoneNumber}`}
              >
                {formatPhoneNumber(emergencyPhoneNumber)}
              </a>
            ) : (
              <span className="italic">No phone</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
