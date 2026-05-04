'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center bg-[#0A0A0F]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className="text-[20px] font-bold text-[#FF003C]"
              style={{ fontFamily: 'var(--font-space), sans-serif' }}
            >
              Sentinel
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] text-[#E0E0E0]/70 hover:text-white transition-colors duration-200"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="inline-block bg-[#FF003C] text-white text-[14px] font-medium px-5 py-2 rounded-md hover:bg-[#FF003C]/90 transition-colors"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#0A0A0F]/95 backdrop-blur-md pt-20">
          <div className="flex flex-col items-center gap-8 pt-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-medium text-white hover:text-[#FF003C] transition-colors"
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="inline-block bg-[#FF003C] text-white text-base font-medium px-6 py-3 rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
