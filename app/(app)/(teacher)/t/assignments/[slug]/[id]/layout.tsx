import { generateGradeSubmissionMetadata } from "@/lib/metadata";
import { ReactNode } from "react";

type Props = {
  params: Promise<{ slug: string; id: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props) {
  const { slug, id } = await params;
  return generateGradeSubmissionMetadata(slug, id);
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
