import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatPhoneNumber } from "@/lib/utils";
import {
  CircleCheckBig,
  Clock,
  Circle,
  Upload,
  User,
  Phone,
  Mail,
} from "lucide-react";
import React from "react";
import { env } from "@/lib/env";
import {
  IconAlertCircle,
  IconClock,
  IconExclamationCircle,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { defaultDocuments } from "./DashboardDocuments";

interface TimelineItemProps {
  status: string;
  title: string;
  description: string;
  date: string;
  isLast: boolean;
}

const TimelineItem = ({
  status,
  title,
  description,
  date,
  isLast,
}: TimelineItemProps) => {
  const getIconConfig = () => {
    switch (status) {
      case "completed":
      case "approved":
        return {
          icon: CircleCheckBig,
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
          textColor: "text-green-600",
        };
      case "pending":
        return {
          icon: IconClock,
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-600",
          textColor: "text-yellow-600",
        };
      case "rejected":
        return {
          icon: IconExclamationCircle,
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
          textColor: "text-red-600",
        };
      default:
        return {
          icon: Circle,
          bgColor: "bg-gray-100",
          borderColor: "border-gray-300",
          textColor: "text-gray-400",
        };
    }
  };

  const config = getIconConfig();
  const Icon = config.icon;

  return (
    <div className="flex gap-4 relative">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "rounded-full p-3 border-2",
            config.bgColor,
            config.borderColor,
            config.textColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 min-h-16 mt-2",
              status === "completed" ? "bg-green-300" : "bg-gray-200"
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-muted-foreground mt-2">{formatDate(date)}</p>
      </div>
    </div>
  );
};

interface Props {
  timelines: any[];
  documents: any[];
  onTabChange?: (tab: string) => void;
}
export const DashboardOverview = ({
  timelines,
  documents,
  onTabChange,
}: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timelines.length > 0 ? (
              timelines.map((item, index) => (
                <TimelineItem
                  key={index}
                  status={item.status}
                  title={item.eventType.replace(/_/g, " ")}
                  description={item.description}
                  date={item.createdAt}
                  isLast={index === timelines.length - 1}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No activity yet. Upload documents or submit your application to
                get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <IconAlertCircle className="size-4 text-primary" />
                Next Steps
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Show rejected documents */}
              {documents.some((doc) => doc.status === "rejected") && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="bg-red-100 rounded-full p-1 mt-0.5">
                      <IconAlertCircle className="size-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-red-700 font-medium">
                        {
                          documents.filter((d) => d.status === "rejected")
                            .length
                        }{" "}
                        document(s) rejected. Please re-upload:
                      </p>
                      <ul className="mt-1 text-sm text-red-700 list-disc list-inside capitalize">
                        {documents
                          .filter((d) => d.status === "rejected")
                          .map((d) => (
                            <li key={d.id}>{d.type.replace(/_/g, " ")}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Show missing required documents */}
              {defaultDocuments.some(
                (d) =>
                  d.required && !documents.some((doc) => doc.type === d.type)
              ) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="bg-yellow-100 rounded-full p-1 mt-0.5">
                      <IconAlertCircle className="size-4 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">
                        Missing required document(s):
                      </p>
                      <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                        {defaultDocuments
                          .filter(
                            (d) =>
                              d.required &&
                              !documents.some((doc) => doc.type === d.type)
                          )
                          .map((d) => (
                            <li key={d.type}>{d.title}</li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload and update buttons */}
              <Button
                onClick={() => onTabChange?.("documents")}
                className="w-full"
              >
                <IconUpload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>

              <Button
                onClick={() => onTabChange?.("profile")}
                variant="outline"
                className="w-full"
              >
                <IconUser className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Admissions Office</p>
                <a
                  href={`tel:${env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {formatPhoneNumber(env.NEXT_PUBLIC_SUPPORT_PHONE_NUMBER)}
                </a>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Email Support</p>
                <a
                  href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                >
                  <Mail className="w-4 h-4" />
                  {env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS}
                </a>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-muted-foreground">
                  Office Hours: Mon-Fri, 8:00 AM - 4:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
