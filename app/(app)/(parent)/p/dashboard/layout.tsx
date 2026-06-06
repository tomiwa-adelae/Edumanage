import { parentMetadata } from "@/lib/metadata";

export const metadata = parentMetadata.dashboard;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
