import { teacherMetadata } from "@/lib/metadata";

export const metadata = teacherMetadata.assignments;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
