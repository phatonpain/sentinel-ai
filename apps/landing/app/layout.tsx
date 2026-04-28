import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sentinel AI — Your API\'s Immune System',
  description: 'AI-powered API security that learns your normal to block the abnormal. Zero-config middleware. Real-time threat detection.',
  openGraph: {
    title: 'Sentinel AI — AI-Powered API Security',
    description: 'Zero-config middleware that detects zero-day attacks, SQL injection, XSS, SSRF, and data exfiltration in real time.',
    url: 'https://sentinel-ai.app',
    siteName: 'Sentinel AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentinel AI — AI-Powered API Security',
    description: 'Your API\'s immune system. Zero-config. <50ms overhead.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
