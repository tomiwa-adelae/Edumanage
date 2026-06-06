import { adminMetadata } from "@/lib/metadata";

export const metadata = adminMetadata.settings;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
