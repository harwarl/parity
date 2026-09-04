"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Switch } from "@/components/ui/Switch";
import { accountInfo as defaultAccount } from "@/lib/dashboard-data";
import type { AccountInfo } from "@/types/tape";

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-4">
      <div>
        <p className="text-sm text-paper">{label}</p>
        {hint && <p className="mt-0.5 font-mono text-xs text-mute">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function AccountTab() {
  const [account, setAccount] = useState<AccountInfo>(defaultAccount);

  return (
    <div>
      <Row label="Agentic MCP" hint="Required before Live mode unlocks.">
        <div className="flex items-center gap-3">
          <Chip tone={account.mcpConnected ? "gap" : "halt"} dot>
            {account.mcpConnected ? "CONNECTED" : "NOT CONNECTED"}
          </Chip>
          {!account.mcpConnected && (
            <Button
              variant="ghost"
              onClick={() =>
                setAccount((current) => ({ ...current, mcpConnected: true }))
              }
            >
              Connect
            </Button>
          )}
        </div>
      </Row>

      <Row label="Geo">
        <span className="font-mono text-sm text-mute">{account.geo}</span>
      </Row>

      <Row label="Paper week" hint="Minimum before Live unlocks.">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gap"
              style={{
                width: `${(account.paperWeek / account.paperWeeksTotal) * 100}%`,
              }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-mute">
            Week {account.paperWeek} of {account.paperWeeksTotal}
          </span>
        </div>
      </Row>

      <Row label="Kill switch" hint="Halts all tapping immediately.">
        <Switch
          checked={account.killSwitchOn}
          tone="rich"
          onChange={(killSwitchOn) =>
            setAccount((current) => ({ ...current, killSwitchOn }))
          }
        />
      </Row>

      <Row label="Export log">
        <Button variant="ghost">Export log</Button>
      </Row>

      <div className="px-5 py-5">
        <p className="max-w-lg font-mono text-xs leading-relaxed text-mute">
          PARITY does not place trades. Every card requires your confirmation
          before anything is sent. This is not investment advice — see Terms
          for the full disclosure.
        </p>
      </div>
    </div>
  );
}
