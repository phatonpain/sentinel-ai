'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripleClick } from '@/hooks/useTripleClick';
import { TextScramble } from './TextScramble';
import { GlassButton } from './GlassButton';

const navLinks = [
  { label: 'Features', href: '#features', effect: 'underline' },
  { label: 'Demo', href: '#demo', effect: 'glow' },
  { label: 'Pricing', href: '#pricing', effect: 'scramble' },
  { label: 'Docs', href: '/docs', effect: 'arrow' },
];

export function Navbar({ onTripleClickLogo }: { onTripleClickLogo?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogoClick = useTripleClick(() => {
    onTripleClickLogo?.();
  });

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(10, 10, 15, 0.6)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={handleLogoClick}>
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-space), sans-serif' }}
            >
              <span className="inline-block text-[#00F0FF] group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-300">
                S
              </span>
              entinelAPI
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={link.href.startsWith('/') && !link.href.startsWith('/#') ? false : undefined}
                className="group relative text-sm text-zinc-400 hover:text-white transition-colors duration-300 py-2"
              >
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
                  </span>
                )}

                {/* Underline effect */}
                {link.effect === 'underline' && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#00F0FF] group-hover:w-full transition-all duration-300" />
                )}

                {/* Glow effect */}
                {link.effect === 'glow' && (
                  <span className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)] transition-opacity duration-300 -z-10" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <GlassButton href="#setup" variant="filled" className="text-xs px-5 py-2.5">
              Initialize My Defense →
            </GlassButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-white"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-[2px] bg-white"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-[2px] bg-white"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              backgroundColor: 'rgba(10, 10, 15, 0.95)',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-3xl font-bold text-white hover:text-[#00F0FF] transition-colors"
                    style={{ fontFamily: 'var(--font-space), sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <GlassButton href="#setup" variant="filled">
                  Initialize My Defense →
                </GlassButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
