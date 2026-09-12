import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ConsoleHeader from "@/components/layout/ConsoleHeader";
import LogTable from "@/components/dashboard/LogTable";
import PaperDiary from "@/components/dashboard/PaperDiary";

export const metadata: Metadata = {
  title: "Log",
};

export default function DashboardLogPage() {
  return (
    <Container className="py-8 sm:py-12">
      <ConsoleHeader
        eyebrow="Your taps and fills · not a brokerage statement"
        heading="Log"
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <LogTable />
        <PaperDiary />
      </div>
    </Container>
  );
}
