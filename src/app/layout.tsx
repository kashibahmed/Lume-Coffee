import type { Metadata } from "next";
import { Londrina_Solid, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const londrinaSolid = Londrina_Solid({
  weight: ["300", "400", "900"],
  subsets: ["latin"],
  variable: "--font-londrina",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lume Coffee Co. — Specialty Coffee & Warm Moments",
  description:
    "Good coffee, brighter days. Experience specialty single-origin coffees, handcrafted iced lattes, and artisan roasts in our warm café sanctuary.",
  keywords: [
    "specialty coffee",
    "Lume Coffee",
    "iced latte",
    "Spanish latte",
    "artisan roast",
    "café",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${londrinaSolid.variable} ${dmSans.variable}`}>
      <body className="font-body bg-brand-cream text-brand-espresso antialiased selection:bg-brand-olive-dark selection:text-brand-cream overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

