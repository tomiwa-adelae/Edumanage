import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.schoolCalendar;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
