export type NavLink = {
  label: string;
  href: string;
};

export type TickerItem = {
  symbol: string;
  name: string;
  /** Gross gap in basis points, signed. Illustrative. */
  gapBps: number;
};

export type WontDoItem = {
  title: string;
  body: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
