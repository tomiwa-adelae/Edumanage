import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.studentsApproval;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
