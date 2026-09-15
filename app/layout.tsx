import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAX Developer Platform",
  description: "Build with the MAX AI Ecosystem.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
