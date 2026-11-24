import type { Metadata } from "next";
import { DM_Serif_Display, Lexend } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Burcu Ozcan — Senior Frontend Developer",
  description:
    "Portfolio of Burcu Ozcan, a Senior Frontend Developer in Malta working with React, Next.js, TypeScript and Tailwind CSS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${lexend.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
