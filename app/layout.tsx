import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <head>
        {/* --- MONETAG EXACT SCRIPT (FOR BOT VERIFICATION) --- */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11049765',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
    {/* 🎬 Ecosystem Banner - PC Optimizer (DARK GLASSMORPHISM) */}
    <div className="w-full bg-[#050505]/80 backdrop-blur-xl border-b border-red-500/30 z-[100] relative">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
            {/* Live Pulsing Dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <p className="text-xs sm:text-sm font-medium text-gray-200 flex flex-wrap items-center justify-center gap-1.5">
              Need 4K Game Clips for your Edits? 
              <a 
                href="https://yt-downloader-pro-teal.vercel.app" 
                target="_blank" 
                rel="noreferrer"
                className="text-red-500 hover:text-red-400 underline underline-offset-4 transition-colors font-bold flex items-center gap-1"
              >
                Use my secret Next-Gen YT-Downloader 🎥
              </a>
            </p>
          </div>
        </div>
        {children}</body>
    </html>
  );
}