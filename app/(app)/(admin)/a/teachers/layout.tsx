import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.teachers;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
