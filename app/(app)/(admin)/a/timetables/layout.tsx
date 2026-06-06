import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.timetables;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
