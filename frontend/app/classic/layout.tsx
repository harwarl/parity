import type { ReactNode } from "react";
import SiteBackground from "@/components/background/SiteBackground";
import ClassicFooter from "@/components/layout/ClassicFooter";
import ClassicNavbar from "@/components/layout/ClassicNavbar";

/** Preserves the pre-redesign landing page exactly as it was, at /classic. */
export default function ClassicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteBackground />
      <ClassicNavbar />
      {children}
      <ClassicFooter />
    </>
  );
}
