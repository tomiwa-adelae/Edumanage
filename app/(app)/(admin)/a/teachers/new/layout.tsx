import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.teachersNew;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
