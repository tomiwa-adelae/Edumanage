import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Create New Timetable",
  description:
    "Create a new class timetable manually or upload multiple timetables in bulk using Excel or CSV files.",
  keywords: [
    "create timetable",
    "new timetable",
    "bulk upload timetable",
    "import timetable",
    "schedule creation",
  ],
  path: "/a/timetables/new",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
