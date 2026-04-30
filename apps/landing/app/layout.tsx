import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sentinel API — AI-Powered API Security & Threat Detection',
  description: 'Proteja suas APIs em tempo real com análise de vulnerabilidades, headers seguros e detecção de ameaças. Setup em 2 minutos.',
  keywords: 'api security, threat detection, vulnerability scanner, api protection, xss, sqli, ssrf',
  authors: [{ name: 'Sentinel API' }],
  openGraph: {
    title: 'Sentinel API — AI-Powered API Security & Threat Detection',
    description: 'Proteja suas APIs em tempo real com análise de vulnerabilidades, headers seguros e detecção de ameaças. Setup em 2 minutos.',
    url: 'https://api-proxy-production-28ff.up.railway.app',
    siteName: 'Sentinel API',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentinel API — AI-Powered API Security & Threat Detection',
    description: 'Proteja suas APIs em tempo real. 21ms de latência. Zero configuração.',
  },
  robots: 'index, follow',
  metadataBase: new URL('https://api-proxy-production-28ff.up.railway.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Sentinel API',
              applicationCategory: 'SecurityApplication',
              description: 'AI-Powered API Security & Threat Detection',
              url: 'https://api-proxy-production-28ff.up.railway.app',
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free',
                  price: '0',
                  priceCurrency: 'USD',
                },
                {
                  '@type': 'Offer',
                  name: 'Pro',
                  price: '49',
                  priceCurrency: 'USD',
                },
                {
                  '@type': 'Offer',
                  name: 'Enterprise',
                  price: '199',
                  priceCurrency: 'USD',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-[#0a0a0f] text-slate-100">
        {children}
      </body>
    </html>
  );
}
