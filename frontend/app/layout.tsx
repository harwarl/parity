import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Web3Provider from "@/components/providers/Web3Provider";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "A basis tape for Robinhood cash equities vs Robinhood Chain stock tokens. GAUGE measures the gap, haircuts fees and slippage, and emits a confirm-gated card. GAUGE does not place.";

export const metadata: Metadata = {
  metadataBase: new URL("https://gauge.example"),
  title: {
    default: "GAUGE · Two prices for the same name. One gap. You tap.",
    template: "%s · GAUGE",
  },
  description,
  openGraph: {
    title: "GAUGE · Two prices for the same name. One gap.",
    description,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Web3Provider>
          <SmoothScroll>{children}</SmoothScroll>
        </Web3Provider>
      </body>
    </html>
  );
}
