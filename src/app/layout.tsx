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
  title: "Research Portfolio — AI × Robotics | 人工智能与机器人研究作品集",
  description:
    "Personal research portfolio: reinforcement learning, robot locomotion, aerial autonomy, multi-agent systems, and foundation model applications. 个人研究作品集。",
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
      <body className="min-h-full bg-[#0a0a0b] text-[#f5f5f7] antialiased">{children}</body>
    </html>
  );
}
