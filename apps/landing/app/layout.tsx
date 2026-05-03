import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import CustomCursor from "@/components/cursor/CustomCursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sentinel-ai.one"),
  title: "Sentinel API — Neural Defense Grid for APIs",
  description:
    "Intercept XSS, SQL Injection, and SSRF in 21ms. Zero config. One header.",
  keywords: [
    "API security",
    "XSS detection",
    "SQL injection",
    "SSRF",
    "AI security",
    "Sentinel",
    "Neural Defense Grid",
  ],
  openGraph: {
    title: "Sentinel API — Neural Defense Grid for APIs",
    description: "Real-time API security with AI-powered threat detection.",
    url: "https://sentinel-ai.one",
    siteName: "Sentinel API",
    images: [
      {
        url: "/og-image.jpg",
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
    title: "Sentinel API — Neural Defense Grid for APIs",
    description: "AI-powered API security with 21ms latency.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Sentinel API?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sentinel API is a Neural Defense Grid that intercepts XSS, SQL Injection, and SSRF threats in real-time with 21ms latency. Zero configuration, one header integration.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to detect XSS in APIs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sentinel API analyzes every request header and payload using AI behavioral patterns. It detects XSS, SQLi, SSRF, and zero-day threats before they reach your server.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is API security latency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most security tools add 100-500ms of latency. Sentinel API operates at 21ms average latency through edge-optimized architecture, ensuring zero performance impact.',
      },
    },
    {
      '@type': 'Question',
      name: 'How to integrate API security with one header?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Add a single X-Sentinel-Api-Key header to your requests. No SDKs, no middleware, no code changes. Works with any stack or framework.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is Neural Defense Grid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Neural Defense Grid is Sentinel API's real-time threat detection engine. It uses AI to analyze API traffic, assign security scores, and block attacks in milliseconds.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="bg-[#0A0A0F] text-[#E0E0E0] font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00F0FF] focus:text-[#0A0A0F] focus:font-bold focus:rounded-lg"
        >
          Skip to main content
        </a>
        <CustomCursor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
