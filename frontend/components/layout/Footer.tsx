import Container from "./Container";

const disclaimers = [
  "signals, not advice",
  "token ≠ share",
  "basis can persist",
  "overnight is not free money",
  "paper is not live",
  "not available where Robinhood Stock Tokens are not",
];

export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[0.95rem] font-semibold tracking-[0.14em] text-text">
            TAPE
          </span>
          <span className="text-text-mute">·</span>
          <span className="text-[0.8rem] text-text-mute">
            Robinhood Chain
          </span>
        </div>

        <p className="flex flex-wrap gap-x-2 gap-y-1 text-[0.78rem] leading-relaxed text-text-mute">
          {disclaimers.map((d, i) => (
            <span key={d} className="whitespace-nowrap">
              {d}
              {i < disclaimers.length - 1 ? (
                <span aria-hidden className="ml-2 text-text-mute/50">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </p>

        <p className="text-[0.78rem] text-text-mute">
          TAPE is self-directed signalling software. It measures a published
          basis and shows a card. It never places, never holds funds, and never
          holds your keys. © {new Date().getFullYear()} TAPE.
        </p>
      </Container>
    </footer>
  );
}
