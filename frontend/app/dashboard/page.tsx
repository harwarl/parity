import type { Metadata } from "next";
import CardsPanel from "@/components/dashboard/CardsPanel";
import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Dashboard",
};

const CAP_TOTAL = 3;
const CAP_USED = 1;

export default function DashboardPage() {
  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.9rem] font-bold tracking-tight text-text sm:text-[2.25rem]">
            Two prices. One opportunity.
          </h1>
          <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-text-dim">
            GAUGE compares Robinhood cash equities (RTH) and chain stock
            tokens (24/7) to find real, net edges after costs.
          </p>
        </div>

        <div className="flex shrink-0 items-stretch divide-x divide-line rounded-xl border border-line-strong bg-surface">
          <div className="px-5 py-3.5">
            <p className="flex items-center gap-1.5 text-[0.78rem] text-text-mute">
              Daily Signal Cap
              <Icon name="info" size={12} />
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: CAP_TOTAL }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-2.5 rounded-full ${
                      i < CAP_USED ? "bg-green" : "border border-line-strong"
                    }`}
                  />
                ))}
              </div>
              <span className="tnum text-[0.8rem] text-text-dim">
                {CAP_USED} / {CAP_TOTAL} used
              </span>
            </div>
          </div>
          <div className="px-5 py-3.5">
            <p className="text-[0.78rem] text-text-mute">Mode</p>
            <p className="mt-2 flex items-center gap-1.5 text-[0.95rem] font-medium text-text">
              Paper
              <Icon name="chevronDown" size={13} className="text-text-mute" />
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CardsPanel />
      </div>
    </Container>
  );
}
