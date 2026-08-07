import type { Metadata } from "next";
import { getProjectsByStatus } from "@/lib/projects";
import { PortfolioIndexClient } from "../portfolio-index-client";

export const metadata: Metadata = {
  title: "Completed Projects | Phoenix Group",
  description:
    "Phoenix Group's delivered developments across Hyderabad — Grade-A commercial campuses handed over and in active use.",
};

export default function CompletedProjectsPage() {
  return <PortfolioIndexClient status="completed" projects={getProjectsByStatus("completed")} />;
}
