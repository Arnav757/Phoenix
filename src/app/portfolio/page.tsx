import type { Metadata } from "next";
import { PortfolioGatewayClient } from "./portfolio-gateway-client";

export const metadata: Metadata = {
  title: "Portfolio | Phoenix Group",
  description:
    "Phoenix Group's portfolio of commercial developments across Hyderabad — upcoming projects under development and completed, delivered campuses.",
};

export default function PortfolioPage() {
  return <PortfolioGatewayClient />;
}
