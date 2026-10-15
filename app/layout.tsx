import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://developers.max-ai.name.ng";
const siteTitle = "Max AI For Developers - The Max AI Ecosystem";
const siteDescription = "Build, connect, and manage applications for the MAX AI Ecosystem. Get started with MAX Auth, OAuth 2.0, developer tools, and integrations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | MAX AI For Developers",
  },
  description: siteDescription,
  applicationName: "MAX AI For Developers",
  keywords: [
    "MAX AI", "MAX AI Ecosystem", "MAX AI Developers", "developer platform",
    "MAX Auth", "OAuth 2.0", "API integrations", "developer tools",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "https://www.max-ai.name.ng/favicon.png", type: "image/svg+xml" }],
    shortcut: ["https://www.max-ai.name.ng/favicon.png"],
    apple: [{ url: "https://www.max-ai.name.ng/favicon.png", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "The MAX AI Ecosystem",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "https://www.max-ai.name.ng/favicon.png", width: 96, height: 96, alt: "MAX AI logo" }],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["https://www.max-ai.name.ng/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
