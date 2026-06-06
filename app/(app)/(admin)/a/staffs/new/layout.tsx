import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.staffsNew;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
