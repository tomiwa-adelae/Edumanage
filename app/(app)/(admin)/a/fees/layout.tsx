import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.fees;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
