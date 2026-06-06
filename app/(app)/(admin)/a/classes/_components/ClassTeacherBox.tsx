import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { formatPhoneNumber } from "@/lib/utils";
import { User } from "@/store/useAuth";
import {
  IconMail,
  IconMessage,
  IconPhone,
  IconSchool,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  teacher: User;
}

export const ClassTeacherBox = ({ teacher }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-start gap-2">
          <IconSchool className="text-primary" />
          Class Teacher
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-start justify-start gap-2">
        <div className="flex-1 flex items-start justify-start gap-2">
          <UserProfilePicture
            src={teacher !== null ? teacher?.image : ""}
            alt={`${teacher !== null && teacher?.firstName}'s picture`}
          />
          <div className="flex-1 space-y-2">
            <h2 className="font-medium text-base md:text-lg">
              {teacher !== null ? (
                `${teacher.title === null ? "" : teacher.title} ${
                  teacher.firstName
                } ${teacher.lastName}`
              ) : (
                <p className="italic">No teacher assigned</p>
              )}
            </h2>
            <div className="text-muted-foreground text-sm md:text-base space-y-1">
              <p className="text-sm flex items-center justify-start gap-1">
                <IconPhone className="size-4" />
                {teacher !== null ? (
                  teacher?.phoneNumber ? (
                    formatPhoneNumber(teacher?.phoneNumber)
                  ) : (
                    <span className="italic">No phone</span>
                  )
                ) : (
                  <span className="italic">No phone</span>
                )}
              </p>
              {teacher !== null ? (
                <a
                  href={`mailto:${teacher?.email}`}
                  className="text-sm flex items-center justify-start gap-1 hover:underline hover:text-primary"
                >
                  <IconMail className="size-4" />
                  {teacher?.email}
                </a>
              ) : (
                <p className="italic flex items-center justify-start gap-1">
                  <IconMail className="size-4" /> No email
                </p>
              )}
            </div>
          </div>
        </div>
        <Button className="w-full md:w-auto" variant={"outline"}>
          <IconMessage />
          Send Message
        </Button>
      </CardContent>
    </Card>
  );
};
