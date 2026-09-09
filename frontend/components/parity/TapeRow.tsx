import SessionPill from "@/components/ui/SessionPill";
import { fmtNet, fmtPrice } from "@/lib/parity/format";
import type { TapeRow as Row } from "@/types/parity";
import GapMeter from "./GapMeter";

/** One name on the tape. cash mid / token-per-share / gap / net bps / session. */
export default function TapeRow({
  row,
  scanning = false,
}: {
  row: Row;
  scanning?: boolean;
}) {
  const dead = row.state === "halt" || row.state === "stale";
  const tradable = row.state === "rth" && row.netBps > 0;

  return (
    <div
      className={`relative px-4 py-3.5 transition-colors duration-500 sm:grid sm:grid-cols-[1.5fr_0.8fr_0.8fr_1.3fr_0.7fr_auto] sm:items-center sm:gap-x-4 ${
        scanning ? "bg-surface" : ""
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-0.5 bg-green transition-opacity duration-500 ${
          scanning ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="flex items-center justify-between sm:block">
        <div className="min-w-0">
          <span className="text-sm font-medium tracking-tight text-text">
            {row.symbol}
          </span>
          <span className="ml-2 hidden text-[0.78rem] text-text-mute md:inline">
            {row.name}
          </span>
        </div>
        <div className="sm:hidden">
          <SessionPill state={row.state} />
        </div>
      </div>

      <div className="tnum mt-2 hidden text-sm text-text-dim sm:mt-0 sm:block">
        {dead ? (
          "—"
        ) : (
          <span key={row.shareMid.toFixed(2)} className="tick-flash">
            {fmtPrice(row.shareMid)}
          </span>
        )}
      </div>
      <div className="tnum hidden text-sm text-text-dim sm:block">
        {dead ? (
          "—"
        ) : (
          <span key={row.tokenPerShare.toFixed(2)} className="tick-flash">
            {fmtPrice(row.tokenPerShare)}
          </span>
        )}
      </div>

      <div className="mt-3 sm:mt-0">
        {dead ? (
          <span className="tnum text-xs text-halt">no quote</span>
        ) : (
          <GapMeter bps={row.basisBps} showLabel={false} />
        )}
      </div>

      <div className="tnum mt-2 hidden text-sm sm:mt-0 sm:block">
        {dead ? (
          <span className="text-text-mute">—</span>
        ) : (
          <span className={tradable ? "text-green" : "text-text-mute"}>
            {row.netBps > 0 ? fmtNet(row.netBps) : "—"}
          </span>
        )}
      </div>

      <div className="hidden justify-self-end sm:block">
        <SessionPill state={row.state} />
      </div>

      <div className="tnum mt-3 flex items-center gap-4 text-[0.78rem] text-text-mute sm:hidden">
        <span>{dead ? "cash —" : `cash ${row.shareMid.toFixed(2)}`}</span>
        <span>{dead ? "token —" : `tok ${row.tokenPerShare.toFixed(2)}`}</span>
        <span className={tradable ? "text-green" : ""}>
          {dead || row.netBps <= 0 ? "net —" : `net ${Math.round(row.netBps)}`}
        </span>
      </div>
    </div>
  );
}
