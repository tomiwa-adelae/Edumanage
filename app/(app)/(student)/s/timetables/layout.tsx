import { studentMetadata } from "@/lib/metadata";

export const metadata = studentMetadata.timetables;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
