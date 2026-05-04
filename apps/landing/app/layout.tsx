import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
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
  title: "Sentinel AI — API Security in 21ms",
  description:
    "Detect XSS, SQL injection, and BOLA attacks before they reach your database. One header. Zero friction.",
  keywords: [
    "API security",
    "XSS detection",
    "SQL injection",
    "BOLA",
    "AI security",
    "Sentinel",
  ],
  openGraph: {
    title: "Sentinel AI — API Security in 21ms",
    description: "Real-time API threat detection. One header. Zero friction.",
    url: "https://sentinel-ai.one",
    siteName: "Sentinel AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sentinel AI — API Security",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentinel AI — API Security in 21ms",
    description: "Real-time API threat detection. One header. Zero friction.",
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
      name: 'What is Sentinel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sentinel is an API security layer that sits between your users and your API. It scans every request for threats in real-time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the free plan work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You get 100 requests per month forever. No credit card required. Upgrade when you need more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to change my code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Add one HTTP header to your requests. That is it. Works with any framework.',
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
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#FF003C] focus:text-white focus:font-bold focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
