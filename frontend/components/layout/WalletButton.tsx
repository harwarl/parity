"use client";

import { useSyncExternalStore } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

/** Real wallet connect (wagmi + viem, injected connector — MetaMask, Coinbase Wallet, etc). */

function truncate(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

const noopSubscribe = () => () => {};

/** True only once mounted on the client — avoids an SSR/hydration mismatch
 * without setState-in-effect (wagmi's connection state can't be known server-side). */
function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const mounted = useMounted();

  if (mounted && isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        title="Disconnect"
        className="tnum group flex items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3 py-1.5 text-[0.78rem] text-text-dim transition-colors hover:border-halt/50"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-green group-hover:bg-halt" />
        <span className="group-hover:hidden">{truncate(address)}</span>
        <span className="hidden text-halt group-hover:inline">Disconnect</span>
      </button>
    );
  }

  const connector = connectors[0];

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => connector && connect({ connector })}
        disabled={!mounted || !connector || isPending}
        className="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-[0.78rem] text-text-dim transition-colors hover:border-text-mute hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Connecting…" : "Connect wallet"}
      </button>
      {mounted && error ? (
        <span className="text-[0.72rem] text-halt">No wallet found</span>
      ) : null}
    </span>
  );
}
