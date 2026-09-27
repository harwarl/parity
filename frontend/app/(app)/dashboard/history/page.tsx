import type { Metadata } from "next";
import { TopBar } from "@/components/app/shell/TopBar";
import { ExportCsvButton } from "@/components/app/history/ExportCsvButton";
import { HistoryContext } from "@/components/app/history/HistoryContext";
import { HistoryView } from "@/components/app/history/HistoryView";

export const metadata: Metadata = { title: "History · GAUGE" };

export default function HistoryPage() {
  return (
    <>
      <TopBar title="History" context={<HistoryContext />} actions={<ExportCsvButton />} />
      <HistoryView />
    </>
  );
}
