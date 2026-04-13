import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DividendPulse — Ex-Dates, Pay-Dates & Yield Tracking",
  description: "Track upcoming dividend ex-dates, pay-dates and yields for 50+ dividend stocks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
