import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Outfit } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "Canoe Country — a Boundary Waters game design",
  description:
    "Technical design and expedition plan for a 3D canoe and kayak game in the Boundary Waters: portages, camp, bugs, bears, and trips of 3 to 14 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${fraunces.variable} ${plex.variable}`}>
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
