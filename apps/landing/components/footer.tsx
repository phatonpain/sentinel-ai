'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, FileText, Activity, Mail } from 'lucide-react';
import { Toast } from './toast';

export function Footer() {
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    apiKey?: string;
  }>({ show: false, type: 'success', title: '', message: '' });

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
      <footer className="relative border-t border-white/5 bg-[#0d0d12]">
        {/* Final CTA */}
        <div className="mx-auto max-w-7xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Protect your API today.
              <br />
              <span className="gradient-text">Takes 2 minutes.</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Join developers who replaced static WAFs with behavioral intelligence.
              First 1,000 requests free every month.
            </p>
            <motion.button
              onClick={handleSetup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sentinel-purple to-sentinel-cyan px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-all glow-purple"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Footer links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sentinel-purple to-sentinel-cyan">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Sentinel <span className="gradient-text">API</span>
                </span>
              </a>
              <p className="text-sm text-slate-500">
                AI-Powered API Security & Threat Detection
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-sm text-slate-500 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-slate-500 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#demo" className="text-sm text-slate-500 hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#docs" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                    <FileText className="h-4 w-4" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/sentinel-ai/sentinel-ai" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://api-proxy-production-28ff.up.railway.app/v1/health" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                    <Activity className="h-4 w-4" />
                    Status Page
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:hello@sentinel-api.dev" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors">
                    <Mail className="h-4 w-4" />
                    hello@sentinel-api.dev
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} Sentinel API. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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
