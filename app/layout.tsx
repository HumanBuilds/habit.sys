import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import "./retro.css";

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Garden",
  description: "A retro pixelated habit tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} retro-theme antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
