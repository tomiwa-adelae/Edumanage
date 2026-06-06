import { teacherMetadata } from "@/lib/metadata";

export const metadata = teacherMetadata.dashboard;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
