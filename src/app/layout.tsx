import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { MotionProvider } from "@/components/motion/MotionProvider";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import hyCommon from "@/locales/hy/common.json";

import "./globals.css";

const defaultDescription = hyCommon.seo.description;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Ruben",
    template: "%s · Ruben",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName: "Ruben",
    description: defaultDescription,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    description: defaultDescription,
    images: [SHARE_IMAGE.url],
  },
};

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
