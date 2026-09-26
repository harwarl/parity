import type { Metadata } from "next";
import { TopBar } from "@/components/app/shell/TopBar";
import { ExportCsvButton } from "@/components/app/history/ExportCsvButton";
import { HistoryView } from "@/components/app/history/HistoryView";

export const metadata: Metadata = { title: "History · GAUGE" };

export default function HistoryPage() {
  return (
    <>
      <TopBar title="History" context="Mon 22 → Fri 26 Sep · 5 sessions" actions={<ExportCsvButton />} />
      <HistoryView />
    </>
  );
}
