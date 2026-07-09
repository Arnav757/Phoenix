import type { Metadata } from "next";
import { PartnersPageClient } from "@/components/partners/partners-page-client";

export const metadata: Metadata = {
  title: "Our Partners | Phoenix Group",
  description:
    "The global engineering ecosystem behind Phoenix — capital partners, contractors, architects, steel and facilities specialists from around the world.",
};

export default function PartnersPage() {
  return <PartnersPageClient />;
}
