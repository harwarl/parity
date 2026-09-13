import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteBackground from "@/components/background/SiteBackground";
import DashboardNav from "@/components/layout/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "GAUGE's console view: the shared tape, the card, and the rails, in one place. Paper by default. GAUGE does not place.",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <SiteBackground />
      <DashboardNav />
      {children}
    </div>
  );
}
