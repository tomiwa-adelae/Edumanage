"use client";
import React, { useState } from "react";
import { IconArrowLeft, IconUpload, IconDownload, IconPlus } from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ManualTimetableCreation } from "./_components/ManualTimetableCreation";
import { BulkUploadTimetable } from "./_components/BulkUploadTimetable";

const CreateTimetablePage = () => {
  const [activeTab, setActiveTab] = useState("manual");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Timetable"
        description="Create a new class timetable manually or upload in bulk"
        back={true}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <IconPlus className="h-4 w-4" />
            Manual Creation
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <IconUpload className="h-4 w-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Timetable Manually</CardTitle>
              <CardDescription>
                Build your timetable slot by slot with our intuitive interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManualTimetableCreation />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Timetable</CardTitle>
              <CardDescription>
                Upload multiple timetables at once using Excel or CSV files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulkUploadTimetable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateTimetablePage;
