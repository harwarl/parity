"use client";

import { useState } from "react";
import {
  Bell,
  CreditCard,
  Link as LinkIcon,
  ScrollText,
  Settings2,
  UserRound,
} from "lucide-react";
import { Sidebar } from "@/components/sections/dashboard/Sidebar";
import { TapeTab } from "@/components/sections/dashboard/TapeTab";
import { CardsTab } from "@/components/sections/dashboard/CardsTab";
import { LogTab } from "@/components/sections/dashboard/LogTab";
import { PolicyTab } from "@/components/sections/dashboard/PolicyTab";
import { AccountTab } from "@/components/sections/dashboard/AccountTab";
import { cn } from "@/lib/cn";
import type { DashboardTab } from "@/types/tape";

const tabMeta: Record<
  DashboardTab,
  { label: string; description: string; icon: typeof ScrollText }
> = {
  tape: {
    label: "Tape",
    description: "Shared names, cash vs token, bps, session.",
    icon: ScrollText,
  },
  cards: {
    label: "Cards",
    description: "Open intents waiting on your tap.",
    icon: CreditCard,
  },
  log: {
    label: "Log",
    description: "Paper fills and live orders.",
    icon: ScrollText,
  },
  policy: {
    label: "Policy",
    description: "Universe, clip size, quiet hours, mode.",
    icon: Settings2,
  },
  account: {
    label: "Account",
    description: "MCP, geo, paper week, kill switch.",
    icon: UserRound,
  },
};

const tabOrder: DashboardTab[] = ["tape", "cards", "log", "policy", "account"];

export function Dashboard() {
  const [tab, setTab] = useState<DashboardTab>("tape");
  const meta = tabMeta[tab];
  const Icon = meta.icon;

  return (
    <div className="relative flex h-180 overflow-hidden rounded-window border border-line bg-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-paper/5 to-transparent"
      />

      <Sidebar active={tab} onSelect={setTab} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Icon size={16} className="text-mute" />
            <span className="text-sm font-medium text-paper">{meta.label}</span>
            <span className="hidden font-mono text-xs text-mute sm:inline">
              {meta.description}
            </span>
          </div>
          <div className="flex items-center gap-3 text-mute">
            <LinkIcon size={14} />
            <Bell size={14} />
          </div>
        </div>

        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-3 py-2 md:hidden">
          {tabOrder.map((value) => {
            const TabIcon = tabMeta[value].icon;
            const isActive = value === tab;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-chip px-3 py-1.5 text-xs transition-colors",
                  isActive
                    ? "bg-paper/[0.06] text-paper"
                    : "text-mute hover:text-paper",
                )}
              >
                <TabIcon size={13} />
                {tabMeta[value].label}
              </button>
            );
          })}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {/* <div className="min-w-0 overflow-hidden rounded-window border border-line"> */}
          {tab === "tape" && <TapeTab />}
          {tab === "cards" && <CardsTab />}
          {tab === "log" && <LogTab />}
          {tab === "policy" && <PolicyTab />}
          {tab === "account" && <AccountTab />}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
