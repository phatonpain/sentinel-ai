'use client';

import Link from 'next/link';
import { ECGCanvas } from './ECGCanvas';

export function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
      <h1
        className="text-white font-bold text-[48px] md:text-[64px] leading-[1.1] max-w-3xl mx-auto"
        style={{ fontFamily: 'var(--font-space), sans-serif' }}
      >
        Your API is under attack. You just don&apos;t know it yet.
      </h1>
      <p
        className="text-[#E0E0E0]/60 text-[18px] max-w-2xl mx-auto mt-6"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Sentinel scans every request in 21ms. Detects threats before they reach your database. One header. Zero friction.
      </p>
      <Link
        href="/register"
        className="inline-block bg-[#FF003C] text-white text-[16px] font-bold px-8 py-4 rounded-lg mt-10 hover:bg-[#FF003C]/90 transition-colors"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Start Free — No credit card
      </Link>
      <ECGCanvas />
    </section>
  );
}
