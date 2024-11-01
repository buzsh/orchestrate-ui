import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopHeader, { TickerItem } from "@/components/TopHeader";
import { startups } from "@/data/sampleData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MarketRecon",
  description: "AI-driven market research and intelligent idea generation",
  openGraph: {
    title: "MarketRecon",
    description: "AI-driven market research and intelligent idea generation",
    url: "https://recon-mauve.vercel.app",
    siteName: "MarketRecon",
    images: [
      {
        url: "https://recon-mauve.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const prepareTickerItems = (): TickerItem[] => {
  return startups
    .map(startup => {
      const latestRound = startup.fundingRounds[0];
      if (latestRound) {
        return {
          id: startup.id,
          name: startup.name,
          latestFundingRound: {
            type: latestRound.type,
            amountRaised: latestRound.amountRaised,
            valuation: latestRound.valuation
          }
        };
      }
      return null;
    })
    .filter((item): item is TickerItem => item !== null);
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tickerItems = prepareTickerItems();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <TopHeader tickerItems={tickerItems} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
