import { teacherMetadata } from "@/lib/metadata";

export const metadata = teacherMetadata.settings;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
