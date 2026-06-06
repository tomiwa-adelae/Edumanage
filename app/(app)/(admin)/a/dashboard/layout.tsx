import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.dashboard;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
