import type { Metadata } from "next";
import { SettingsView } from "@/components/app/settings/SettingsView";

export const metadata: Metadata = { title: "Settings · GAUGE" };

export default function SettingsPage() {
  return <SettingsView />;
}
