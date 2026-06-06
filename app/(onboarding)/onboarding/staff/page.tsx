// Force the page to be client-rendered
export const dynamic = "force-dynamic";
import ClientOnboardingStaff from "../../_components/ClientOnboardingStaff";
import { onboardingMetadata } from "@/lib/metadata";

export const metadata = onboardingMetadata.staff;

export default function page() {
  return <ClientOnboardingStaff />;
}
