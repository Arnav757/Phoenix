import type { Metadata } from "next";
import { AwardsPageClient } from "./awards-page-client";

export const metadata: Metadata = {
  title: "Awards & Certifications | Phoenix Group",
  description:
    "Two decades of steady delivery, precertified green from the first drawing, and recognised across the industry. Phoenix Group awards and certifications.",
};

export default function AwardsPage() {
  return <AwardsPageClient />;
}
