import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { MotionProvider } from "@/components/motion/MotionProvider";
import {
  createRootMetadata,
  resolvePublicAppUrl,
} from "@/lib/seo/site-metadata";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return createRootMetadata(resolvePublicAppUrl());
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `data-scroll-behavior` keeps router navigation jump-free while in-page
  // scrolling stays smooth (see `.profile-desktop-page` in globals.css).
  return (
    <html
      lang="hy"
      className="h-full"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col overflow-x-hidden antialiased`}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
