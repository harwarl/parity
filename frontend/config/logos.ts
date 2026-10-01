/**
 * Company logos for the watched names (public/svgs). Drawn as one-colour
 * CSS masks in the badge's text colour, so every logo matches the mono
 * badges and stays visible on the dark ground (the source files are mostly
 * black-on-transparent).
 *
 * `mode`: "alpha" masks the drawn shape. "luminance" keeps only the light
 * parts, for coinbase.svg and robinhood.svg (white marks on solid discs).
 * Names without a file (PLTR) fall back to the ticker text.
 */
export type Logo = { src: string; mode: "alpha" | "luminance"; scale?: number };

export const LOGOS: Record<string, Logo> = {
  AAPL: { src: "/svgs/apple.svg", mode: "alpha", scale: 0.5 },
  // A wide wordmark ("AMD" + arrow), so it gets a bigger box to stay legible.
  AMD: { src: "/svgs/amd.svg", mode: "alpha", scale: 0.7 },
  AMZN: { src: "/svgs/amazon.svg", mode: "alpha", scale: 0.62 },
  COIN: { src: "/svgs/coinbase.svg", mode: "luminance", scale: 0.66 },
  // google.svg is currently the Chrome mark, not Google's "G": swap the file when there is one.
  GOOGL: { src: "/svgs/google.svg", mode: "alpha", scale: 0.56 },
  // White feather on a green disc, like coinbase.svg. Only as HOOD's ticker
  // badge: design.md §5.9 keeps Robinhood-the-partner as text only.
  HOOD: { src: "/svgs/robinhood.svg", mode: "luminance", scale: 0.66 },
  META: { src: "/svgs/meta.svg", mode: "alpha", scale: 0.62 },
  MSFT: { src: "/svgs/microsoft.svg", mode: "alpha", scale: 0.5 },
  NVDA: { src: "/svgs/nvidia.svg", mode: "alpha", scale: 0.6 },
  TSLA: { src: "/svgs/tesla.svg", mode: "alpha", scale: 0.52 },
};
