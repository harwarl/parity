import {
  ChevronDown,
  CreditCard,
  ScrollText,
  Search,
  Settings2,
  SquarePen,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/cn";
import type { DashboardTab } from "@/types/tape";

const navItems: { tab: DashboardTab; label: string; icon: typeof Search }[] = [
  { tab: "tape", label: "Tape", icon: ScrollText },
  { tab: "cards", label: "Cards", icon: CreditCard },
  { tab: "log", label: "Log", icon: ScrollText },
  { tab: "policy", label: "Policy", icon: Settings2 },
  { tab: "account", label: "Account", icon: UserRound },
];

export function Sidebar({
  active,
  onSelect,
}: {
  active: DashboardTab;
  onSelect: (tab: DashboardTab) => void;
}) {
  return (
    <div className="hidden w-[212px] shrink-0 flex-col border-r border-line py-3 md:flex">
      <div className="flex items-center justify-between px-4 pb-6">
        <div className="flex items-center gap-1.5">
          <Logo className="text-sm" />
          <ChevronDown size={13} className="text-mute" />
        </div>
        <div className="flex items-center gap-2.5 text-mute">
          <Search size={14} />
          <SquarePen size={14} />
        </div>
      </div>

      <nav className="flex flex-col gap px-2">
        {navItems.map(({ tab, label, icon: Icon }) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onSelect(tab)}
              className={cn(
                "flex items-center gap-2.5 rounded-chip px-2.5 py-2 text-left text-sm transition-colors",
                isActive
                  ? "bg-paper/[0.06] text-paper"
                  : "text-mute hover:bg-paper/[0.03] hover:text-paper",
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
