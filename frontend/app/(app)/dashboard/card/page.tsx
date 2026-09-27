import type { Metadata } from "next";
import { CardTopBar } from "@/components/app/card/CardTopBar";
import { CardView } from "@/components/app/card/CardView";

export const metadata: Metadata = { title: "Card · GAUGE" };

export default function CardPage() {
  return (
    <>
      <CardTopBar />
      <CardView />
    </>
  );
}
