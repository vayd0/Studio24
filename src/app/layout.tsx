import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const eurostile = localFont({
  src: "../../public/fonts/eurostile.ttf",
  variable: "--font-eurostile-local",
  weight: "400",
  display: "swap",
});

const kaigo = localFont({
  src: "../../public/fonts/KaigoDemo.otf",
  variable: "--font-kaigo-local",
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio 24 — Architecture",
  description:
    "Studio 24 conçoit et réalise des maisons individuelles, extensions et bâtiments professionnels.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${eurostile.variable} ${kaigo.variable} ${inter.variable}`}>
      <head>
        <noscript>
          <style>{"[data-intro-overlay]{display:none}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
