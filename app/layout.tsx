import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import { Footer } from "@/components/Footer";

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit.sys",
  description: "A mechanical 1-bit habit tracking operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} dither-50 retro-theme antialiased h-screen overflow-hidden`}
      >
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}