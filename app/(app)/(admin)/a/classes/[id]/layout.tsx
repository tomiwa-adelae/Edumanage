import { generateClassDetailsMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

type Props = {
  params: Promise<{ id: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return generateClassDetailsMetadata(id);
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
