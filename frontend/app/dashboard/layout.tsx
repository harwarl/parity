import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardNav from "@/components/layout/DashboardNav";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "TAPE's console view: the shared tape, the card, and the rails, in one place. Paper by default. TAPE does not place.",
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-ground">
      <DashboardNav />
      {children}
    </div>
  );
}
