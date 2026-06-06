import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.assessment;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
