import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopHeader from "@/components/TopHeader";
import { Providers } from './providers';

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
  title: "OrchestrateUI",
  description: "AI-driven market research and intelligent idea generation",
  openGraph: {
    title: "OrchestrateUI",
    description: "AI-driven market research and intelligent idea generation",
    url: "https://recon-mauve.vercel.app",
    siteName: "OrchestrateUI",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <TopHeader />
        <main className="flex-1 overflow-hidden">
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
