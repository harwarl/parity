import type { ReactNode } from "react";
import SiteBackground from "@/components/background/SiteBackground";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteBackground />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
