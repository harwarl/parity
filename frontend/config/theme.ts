/**
 * PARITY palette mirror for TS-land (WebGL materials, canvas, charts).
 * The canonical source is app/globals.css. One green accent, used sparingly.
 */
export const palette = {
  ground: "#0a0a0a",
  surface: "#101010",
  surface2: "#161616",
  text: "#f4f4f3",
  textDim: "#a6a6a3",
  textMute: "#6f6f6c",
  green: "#00dc7a",
  greenInk: "#04140c",
  halt: "#5b5b58",
} as const;

export type PaletteToken = keyof typeof palette;
