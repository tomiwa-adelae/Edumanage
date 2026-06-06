import { adminMetadata, generateStudentProfileMetadata, generateStudentEditMetadata, generateStudentApprovalMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

// This will be overridden by child pages with dynamic metadata
export const metadata = adminMetadata.students;

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
