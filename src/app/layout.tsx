import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { PageTransitionProvider } from "@/components/page-transition";
import "./globals.css";

// Brand typeface is Untitled Sans (Klim, licensed). Inter is the web
// stand-in until licensed webfont files are provided.
const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phoenix Group | Let's Build the Extraordinary",
  description:
    "Premium construction developer in Hyderabad — 40 million sq ft of completed and upcoming projects since 2001.",
  icons: { icon: "/phoenix/images/favicon-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="phoenix min-h-full flex flex-col">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
