import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Low-End PC Optimizer',
  description: 'Boost your FPS and reduce lag for low-end PCs.',
  // 👇 Monetag verification tag 👇
  other: {
    monetag: 'b590d3e87395d94b240552f74209c85d',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* --- MONETAG ADS SCRIPT (LAZY LOADED FOR AWWWARDS LEVEL PERFORMANCE) --- */}
        <Script
          src="https://al5sm.com/tag.min.js"
          data-zone="11049765"
          strategy="lazyOnload"
        />
        
        {children}
      </body>
    </html>
  );
}