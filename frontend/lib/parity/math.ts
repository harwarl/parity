/**
 * The math shown on the site. Get it exactly right (CLAUDE.md).
 *
 *   token_per_share = chainlink_usd / (uiMultiplier / 1e18)
 *   basis_bps       = (token_per_share - share_mid) / share_mid * 10_000
 *   net_bps         = |basis_bps| - fee - slip(clip) - buffer
 *
 * The multiplier is NEVER applied to the cash / RHJ feed.
 */

const WAD = 1e18;

export function tokenPerShare(chainlinkUsd: number, uiMultiplier: number): number {
  return chainlinkUsd / (uiMultiplier / WAD);
}

export function basisBps(tokenPerShareValue: number, shareMid: number): number {
  return ((tokenPerShareValue - shareMid) / shareMid) * 10_000;
}

/** Slippage grows with clip size. Illustrative curve for the marketing site. */
export function slipBps(clipUsd: number): number {
  return 3 + Math.round((clipUsd / 25) * 3);
}

export interface HaircutInput {
  gapBps: number;
  clipUsd: number;
  feeBps?: number;
  bufferBps?: number;
}

export function netBps({
  gapBps,
  clipUsd,
  feeBps = 3,
  bufferBps = 5,
}: HaircutInput) {
  const gap = Math.abs(Math.round(gapBps));
  const fee = feeBps;
  const slip = slipBps(clipUsd);
  const buffer = bufferBps;
  return {
    gap,
    fee,
    slip,
    buffer,
    net: gap - fee - slip - buffer,
  };
}
