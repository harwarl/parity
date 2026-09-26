import type { Metadata } from "next";
import { ACTIVE } from "@/lib/gauge/model";
import { TopBar } from "@/components/app/shell/TopBar";
import { CardView } from "@/components/app/card/CardView";

export const metadata: Metadata = { title: `Card · ${ACTIVE.sym} · GAUGE` };

export default function CardPage() {
  return (
    <>
      <TopBar
        title={`Card · ${ACTIVE.sym}`}
        context={
          <>
            {ACTIVE.id} · #2 today · <b>emitted {ACTIVE.emitted} ET</b>
          </>
        }
        pills={["rth", "cap"]}
      />
      <CardView />
    </>
  );
}
