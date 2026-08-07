import type { Metadata } from "next";
import { getProjectsByStatus } from "@/lib/projects";
import { PortfolioIndexClient } from "../portfolio-index-client";

export const metadata: Metadata = {
  title: "Upcoming Projects | Phoenix Group",
  description:
    "Phoenix Group's developments currently under construction across Hyderabad — SEZ campuses and commercial towers.",
};

export default function UpcomingProjectsPage() {
  return <PortfolioIndexClient status="upcoming" projects={getProjectsByStatus("upcoming")} />;
}
