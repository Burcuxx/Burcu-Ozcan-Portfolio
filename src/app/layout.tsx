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

/** Applies a saved theme choice before the first paint, so the wrong theme never flashes. */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export const metadata: Metadata = {
  title: "Burcu Ozcan — Senior Frontend Developer",
  description:
    "Portfolio of Burcu Ozcan, a Senior Frontend Developer in Malta working with React, Next.js, TypeScript and Tailwind CSS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below may set data-theme before React
    // hydrates, which is expected (see the Next.js "preventing flash before hydration" guide).
    <html
      lang="en"
      className={`${dmSerif.variable} ${lexend.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
