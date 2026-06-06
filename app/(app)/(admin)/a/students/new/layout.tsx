import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.studentsNew;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
