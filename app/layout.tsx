import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopHeader from "@/components/TopHeader";
import { Providers } from './providers';
import { Suspense } from 'react';

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
  description: "Supercharge multi-agent orchestration with a visual builder",
  openGraph: {
    title: "OrchestrateUI",
    description: "Supercharge multi-agent orchestration with a visual builder",
    url: "https://orchestrate-ui.vercel.app",
    siteName: "OrchestrateUI",
    images: [
      {
        url: "https://orchestrate-ui.vercel.app/og-image.jpg",
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
            <Suspense fallback={
              <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                  <p className="mt-4">Loading...</p>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </Providers>
        </main>
      </body>
    </html>
  );
}
