import { generateEditUserProfileMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

type Props = {
  params: Promise<{ username: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  return generateEditUserProfileMetadata(username);
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
