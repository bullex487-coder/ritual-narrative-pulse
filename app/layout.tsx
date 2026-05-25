// ============================================================
// app/layout.tsx
// Root layout — fonts, global styles, metadata
// ============================================================

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Narrative Pulse — AI Crypto Sentiment Oracle",
  description:
    "AI-powered crypto market sentiment analysis on the Ritual ecosystem. " +
    "Real-time narrative strength, hype probability, and risk assessment.",
  keywords: ["crypto", "AI", "sentiment", "Ritual", "Web3", "DeFi", "oracle"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetBrains.variable} dark`}>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
