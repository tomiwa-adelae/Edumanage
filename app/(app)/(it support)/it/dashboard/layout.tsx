import { staffMetadata } from "@/lib/metadata";

export const metadata = staffMetadata.itSupport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
