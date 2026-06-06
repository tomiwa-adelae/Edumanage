// This is a server component
export const dynamic = "force-dynamic";

import ClientOnboardingStudent from "../../_components/ClientOnboardingStudent";
import { onboardingMetadata } from "@/lib/metadata";

export const metadata = onboardingMetadata.student;

export default function page() {
  return <ClientOnboardingStudent />;
}
