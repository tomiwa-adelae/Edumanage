import { studentMetadata } from "@/lib/metadata";

export const metadata = studentMetadata.settings;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
