import type { Metadata } from "next";
import { InnovationsPageClient } from "./innovations-page-client";

export const metadata: Metadata = {
  title: "Innovations | Phoenix Group",
  description:
    "Drones and AI-driven site monitoring, recyclable steel construction, smart campus services, destination-controlled elevators, and IGBC Platinum eco-friendly buildings — innovation across every stage of a Phoenix Group project.",
};

export default function InnovationsPage() {
  return <InnovationsPageClient />;
}
