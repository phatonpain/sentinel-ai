'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Toast } from './toast';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For personal projects and validation.',
    features: [
      '100 req/min',
      'Basic security analysis',
      'Headers & SSL check',
      'Community support',
      '1 project',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For startups with APIs in production.',
    features: [
      '1,000 req/min',
      'Advanced analysis + reports',
      'XSS, SQLi, SSRF detection',
      'Detailed Security Score',
      'Slack / webhook alerts',
      '5 projects',
    ],
    cta: 'Choose Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For companies with compliance needs.',
    features: [
      '10,000 req/min',
      'SLA 99.9% guaranteed',
      'Full multi-tenant',
      'Priority 24/7 support',
      'SSO & audit logs',
      'Unlimited projects',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingSection() {
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
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

  const handlePro = () => {
    setToast({
      show: true,
      type: 'info',
      title: 'Coming Soon',
      message: 'Pro plan coming soon. Join the waitlist at hello@sentinel-api.dev',
    });
  };

  return (
    <>
      <section id="pricing" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-sentinel-green uppercase tracking-widest mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Choose your <span className="gradient-text">plan</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-400">
              Start free and scale as you need. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border p-6 sm:p-8 ${
                  plan.highlighted
                    ? 'border-sentinel-purple/50 bg-gradient-to-b from-sentinel-purple/10 to-transparent glow-purple'
                    : 'border-white/5 bg-[#0d0d12]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sentinel-purple to-sentinel-cyan px-3 py-1 text-xs font-semibold text-white">
                      <Zap className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm text-slate-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{plan.description}</p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check
                        className={`h-5 w-5 shrink-0 ${
                          plan.highlighted ? 'text-sentinel-purple' : 'text-slate-500'
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.name === 'Free' && (
                  <button
                    onClick={handleSetup}
                    className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-sentinel-purple to-sentinel-cyan text-white hover:opacity-90'
                        : 'border border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
                {plan.name === 'Pro' && (
                  <button
                    onClick={handlePro}
                    className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-sentinel-purple to-sentinel-cyan text-white hover:opacity-90'
                        : 'border border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
                {plan.name === 'Enterprise' && (
                  <a
                    href="mailto:hello@sentinel-api.dev"
                    className={`mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-sentinel-purple to-sentinel-cyan text-white hover:opacity-90'
                        : 'border border-white/10 text-white hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
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
