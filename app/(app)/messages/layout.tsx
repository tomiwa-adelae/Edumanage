import { sharedMetadata } from "@/lib/metadata";

export const metadata = sharedMetadata.messages;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
