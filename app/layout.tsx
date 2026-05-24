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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}