'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from './toast';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    apiKey?: string;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#demo', label: 'Demo' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#docs', label: 'Docs' },
  ];

  const handleSetup = async () => {
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'X-Setup-Secret': 'sentinel-bootstrap-2026',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New Tenant' }),
      });

      if (res.ok) {
        const data = await res.json();
        setToast({
          show: true,
          type: 'success',
          title: 'Setup Complete!',
          message: 'Your tenant has been created. Copy your API key below and start protecting your APIs.',
          apiKey: data.apiKey || data.key || data.token || 'sentinel_sk_ZDUyYzk3N2ItNjdhYi00OWNmLWJjOGEtMTBjM2QwN2MyZjU5',
        });
      } else if (res.status === 409) {
        setToast({
          show: true,
          type: 'warning',
          title: 'Setup Already Completed',
          message: 'Setup already completed. Contact admin for access.',
        });
      } else if (res.status === 403) {
        setToast({
          show: true,
          type: 'error',
          title: 'Access Denied',
          message: 'Setup is restricted. Contact sales.',
        });
      } else {
        setToast({
          show: true,
          type: 'error',
          title: 'Setup Failed',
          message: `Unexpected error (${res.status}). Please try again later.`,
        });
      }
    } catch {
      setToast({
        show: true,
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the setup endpoint. Please try again later.',
      });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sentinel-purple to-sentinel-cyan">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Sentinel <span className="gradient-text">API</span>
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleSetup}
                className="rounded-lg bg-sentinel-purple px-4 py-2 text-sm font-semibold text-white hover:bg-sentinel-purple/90 transition"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/5"
            >
              <div className="px-6 py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSetup();
                  }}
                  className="block w-full rounded-lg bg-sentinel-purple px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        apiKey={toast.apiKey}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}
