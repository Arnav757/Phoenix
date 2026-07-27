import type { Metadata } from "next";
import { PhoenixFoundationPageClient } from "./phoenix-foundation-page-client";

export const metadata: Metadata = {
  title: "Phoenix Foundation | Phoenix Group",
  description:
    "Phoenix Foundation's philanthropy and CSR initiatives — Vaikuntha Mahaprasthanam, Phoenix Arena, the Sabarimala Dwajasthambham, MISAAL Hyderabad, the Phoenix Eco-Forest, Sparsh Hospice Centre, the Sankara Eye Hospital partnership, and more.",
};

export default function PhoenixFoundationPage() {
  return <PhoenixFoundationPageClient />;
}
