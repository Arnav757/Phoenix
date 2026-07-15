import type { Metadata } from "next";
import { TeamPageClient } from "@/components/team/team-page-client";

export const metadata: Metadata = {
  title: "Our Team | Phoenix Group",
  description:
    "The leadership behind two decades of steady delivery in Hyderabad — Phoenix Group's development, design and engineering team.",
};

export default function TeamPage() {
  return <TeamPageClient />;
}
