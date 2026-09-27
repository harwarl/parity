"use client";

import { ACTIVE } from "@/lib/gauge/model";
import { etClock, shortCardId } from "@/lib/gauge/adapt";
import { TopBar } from "@/components/app/shell/TopBar";
import { useApiActiveCard } from "@/hooks/useApiActiveCard";

/** The Card screen's top bar: the open card from gauge-api, or the sample one. */
export function CardTopBar() {
  const api = useApiActiveCard();
  const card = api ? api.card : null;
  const title = api ? (card ? `Card · ${card.sym}` : "Card") : `Card · ${ACTIVE.sym}`;
  const context = api ? (
    card ? (
      <>
        <span title={card.id}>{shortCardId(card.id)}</span> · <b>emitted {etClock(card.openedAt)} ET</b>
      </>
    ) : (
      "no open card"
    )
  ) : (
    <>
      {ACTIVE.id} · #2 today · <b>emitted {ACTIVE.emitted} ET</b>
    </>
  );
  return <TopBar title={title} context={context} pills={["rth", "cap"]} />;
}
