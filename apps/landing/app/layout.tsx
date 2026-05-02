import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel API — Neural Defense Grid",
  description: "AI-powered API security. Real-time threat detection with 21ms latency. Detect XSS, SQL Injection, SSRF before exploitation.",
  keywords: ["API security", "XSS detection", "SQL injection", "SSRF", "AI security", "Sentinel"],
  openGraph: {
    title: "Sentinel API — Neural Defense Grid",
    description: "Real-time API security with AI-powered threat detection.",
    url: "https://sentinel-ai.one",
    siteName: "Sentinel API",
    images: [
      {
        url: "https://sentinel-ai.one/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sentinel API — Neural Defense Grid",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinel API — Neural Defense Grid",
    description: "AI-powered API security with 21ms latency.",
    images: ["https://sentinel-ai.one/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
