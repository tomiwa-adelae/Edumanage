import { NothingFound } from "@/components/NothingFound";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfilePicture } from "@/components/UserProfilePicture";
import { Class, User } from "@/store/useAuth";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

interface Props {
  teachers: User[];
}

export const TeacherLists = ({ teachers }: Props) => {
  return (
    <div className="grid gap-4 max-w-full overflow-hidden">
      {teachers?.length === 0 && <NothingFound message="No teachers found" />}
      {teachers?.map((teacher) => (
        <Card key={teacher?.id} className="max-w-full overflow-hidden">
          <CardContent className="flex items-start justify-start gap-3 max-w-full overflow-hidden">
            <UserProfilePicture
              src={teacher?.image}
              alt={`${teacher?.firstName}'s picture`}
            />
            <div className="space-y-4 w-full max-w-full overflow-hidden">
              <div>
                <h2 className="text-base md:text-lg font-medium">
                  {teacher?.firstName} {teacher?.lastName}
                </h2>
                <a
                  href={`mailto:${teacher?.email}`}
                  className="text-sm block text-muted-foreground hover:text-primary hover:underline"
                >
                  {teacher?.email}
                </a>
              </div>

              <div className="w-full max-w-full overflow-hidden">
                <small className="block text-xs text-muted-foreground">
                  Class Teacher:
                </small>
                <div className="relative w-full max-w-full">
                  <div className="flex gap-1 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
                    {teacher?.Teacher?.classes &&
                    teacher.Teacher.classes.length > 0 ? (
                      teacher.Teacher.classes.map((c) => (
                        <Badge key={c.id}>
                          {c.level} {c.section}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="italic">
                        No class assigned
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-full overflow-hidden">
                <small className="block text-xs text-muted-foreground">
                  Teaching Subjects:
                </small>
                <div className="relative w-full max-w-full">
                  <div className="flex gap-1 overflow-x-auto whitespace-nowrap p-1 custom-scroll">
                    {teacher?.Teacher?.assignments.length === 0 && (
                      <Badge variant="secondary" className="italic">
                        No subjects assigned
                      </Badge>
                    )}
                    {teacher?.Teacher?.assignments.map((a, index) => (
                      <Badge key={index} variant={"secondary"}>
                        {a.Subject.name} <IconTrash />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
