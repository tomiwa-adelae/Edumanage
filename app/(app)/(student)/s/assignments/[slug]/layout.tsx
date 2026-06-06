import { generateStudentAssignmentMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

type Props = {
  params: Promise<{ slug: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return generateStudentAssignmentMetadata(slug);
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
