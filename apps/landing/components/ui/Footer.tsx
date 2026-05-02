'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TextScramble } from './TextScramble';

const footerLinks = [
  { label: 'Features', href: '#features', effect: 'underline' },
  { label: 'Demo', href: '#demo', effect: 'glow' },
  { label: 'Pricing', href: '#pricing', effect: 'scramble' },
  { label: 'Docs', href: '/docs', effect: 'arrow' },
  { label: 'GitHub', href: 'https://github.com/phatonpain/sentinel-landing', effect: 'rotate', external: true },
  { label: 'Twitter', href: 'https://twitter.com', effect: 'fly', external: true },
];

export function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative z-30 bg-[#0A0A0F] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Left column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                <span className="text-[#00F0FF]">S</span>entinelAPI
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-xs">
              Neural Defense Grid for APIs.
            </p>
          </div>

          {/* Right column — links */}
          <div className="grid grid-cols-2 gap-4">
            {footerLinks.map((link) => (
              <LinkHover key={link.label} link={link} />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <label
            className="block text-xs text-zinc-400 mb-3 font-mono"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Get threat intel — no spam, ever.
          </label>
          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 bg-transparent border-b border-zinc-700 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF] transition-colors"
              style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            />
            <button className="text-[#00F0FF] hover:text-white transition-colors px-2">
              →
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center md:text-left">
          <p
            className="text-xs text-zinc-400 font-mono"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            © 2026 Sentinel API. All systems nominal.
          </p>
        </div>
      </div>
    </footer>
  );
}

function LinkHover({ link }: { link: typeof footerLinks[0] }) {
  const baseClasses = 'group relative inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors py-2';

  const content = (
    <span className={baseClasses}>
      {link.effect === 'scramble' ? (
        <TextScramble text={link.label} />
      ) : (
        <span className="flex items-center gap-1">
          {link.label}
          {link.effect === 'arrow' && (
            <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              →
            </span>
          )}
          {link.effect === 'rotate' && (
            <span className="inline-block group-hover:rotate-[360deg] transition-transform duration-500">
              ↻
            </span>
          )}
          {link.effect === 'fly' && (
            <span className="inline-block group-hover:-translate-y-1 transition-transform duration-300">
              🐦
            </span>
          )}
        </span>
      )}

      {link.effect === 'underline' && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#00F0FF] group-hover:w-full transition-all duration-300" />
      )}

      {link.effect === 'glow' && (
        <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)] transition-opacity duration-300 -z-10" />
      )}
    </span>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={link.href}>{content}</Link>;
}
