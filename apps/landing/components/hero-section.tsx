'use client';

import { motion } from 'framer-motion';
import { Shield, ArrowRight, Zap, Activity } from 'lucide-react';
import { useState } from 'react';
import { Toast } from './toast';

export function HeroSection() {
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    apiKey?: string;
  }>({ show: false, type: 'success', title: '', message: '' });

  const handleSetup = async () => {
    try {
      const res = await fetch('https://api-proxy-production-28ff.up.railway.app/v1/setup', {
        method: 'POST',
        headers: {
          'X-Setup-Secret': 'sentinel-bootstrap-2026',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'New Tenant' }),
      });

      if (res.status === 200) {
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.1)_0%,_transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sentinel-purple/20 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sentinel-cyan/20 rounded-full blur-[128px] animate-pulse-slow" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-sentinel-green/30 bg-sentinel-green/10 px-4 py-1.5 text-sm font-medium text-sentinel-green mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sentinel-green" />
            </span>
            API live in production
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-5xl mx-auto text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white"
          >
            Protect your{' '}
            <span className="gradient-text">APIs</span>{' '}
            with Artificial Intelligence
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed"
          >
            Real-time security analysis.{' '}
            <span className="text-sentinel-cyan font-medium">21ms latency.</span>{' '}
            Zero configuration. Detect XSS, SQL Injection, SSRF and more before someone exploits it.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleSetup}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sentinel-purple to-sentinel-cyan px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-all glow-purple"
            >
              <Zap className="h-5 w-5" />
              Get Started Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#docs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 transition-all"
            >
              <Shield className="h-5 w-5" />
              View Documentation
            </a>
          </motion.div>

          {/* API Endpoint info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 inline-flex items-center gap-3 rounded-xl glass px-6 py-3"
          >
            <Activity className="h-4 w-4 text-sentinel-green" />
            <code className="text-sm text-slate-300">
              POST https://api-proxy-production-28ff.up.railway.app/v1/inspect
            </code>
          </motion.div>

          {/* Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:block absolute left-8 top-1/3 animate-float"
          >
            <div className="rounded-2xl glass p-4 glow-purple">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sentinel-green/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-sentinel-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Verdict</p>
                  <p className="text-xs text-sentinel-green">ALLOW</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden lg:block absolute right-8 top-1/2 animate-float"
            style={{ animationDelay: '3s' }}
          >
            <div className="rounded-2xl glass p-4 glow-cyan">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sentinel-cyan/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-sentinel-cyan" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Risk Score</p>
                  <p className="text-xs text-sentinel-cyan">0/100</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
