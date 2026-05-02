'use client';

import { motion } from 'framer-motion';
import { PricingCard } from '@/components/ui/PricingCard';
import { ShieldDraw } from '@/components/ui/ShieldDraw';
import { Footer } from '@/components/ui/Footer';

const trustSignals = [
  { label: '30-day money-back guarantee', icon: ShieldCheckIcon },
  { label: 'SSL Secure', icon: LockIcon },
  { label: 'GDPR Compliant', icon: ShieldGDPRIcon },
  { label: 'SOC 2 Type II', icon: CertificateIcon },
];

export function Act5_Pricing() {
  return (
    <section id="pricing" className="relative z-30 bg-[#0A0A0F]" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-16">
        {/* Section title */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl md:text-[5vw] font-black text-white tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            {'Choose Your Protocol'.split(' ').map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
          <motion.p
            className="mt-4 text-lg text-white/60 font-light"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Select the defense level for your APIs.
          </motion.p>
        </motion.div>

        {/* Pricing Cards — Asymmetric Layout */}
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-4">
          {/* Free — left */}
          <div className="flex-1 order-2 md:order-1">
            <PricingCard
              variant="free"
              name="Observer"
              price="$0"
              period="/month"
              description="For personal projects and validation."
              features={[
                '100 req/min',
                'Basic security analysis',
                'Headers & SSL check',
                'Community support',
                '1 project',
              ]}
              cta="Initialize Free"
              href="#setup"
              delay={0.1}
            />
          </div>

          {/* Pro — center, highlighted */}
          <div className="flex-1 order-1 md:order-2 md:scale-[1.03]">
            <PricingCard
              variant="pro"
              name="Guardian"
              badge="Most Deployed"
              price="$49"
              period="/month"
              description="For startups with APIs in production."
              features={[
                '1,000 req/min',
                'Advanced analysis + reports',
                'XSS, SQLi, SSRF detection',
                'Detailed Security Score',
                'Slack / webhook alerts',
                '5 projects',
              ]}
              cta="Activate My Pro"
              href="#setup"
              delay={0.2}
            />
          </div>

          {/* Enterprise — right */}
          <div className="flex-1 order-3 md:order-3">
            <PricingCard
              variant="enterprise"
              name="Sentinel"
              price="Custom"
              period=""
              description="For companies with compliance needs."
              features={[
                '10,000 req/min',
                'SLA 99.9% guaranteed',
                'Full multi-tenant',
                'Priority 24/7 support',
                'SSO & audit logs',
                'Unlimited projects',
              ]}
              cta="Contact Sales"
              href="mailto:inaciofelipe40@gmail.com?subject=Sentinel%20Enterprise%20Inquiry"
              delay={0.3}
            />
          </div>
        </div>

        {/* Trust Signals */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 md:gap-8 mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {trustSignals.map((signal, i) => (
            <motion.div
              key={signal.label}
              className="flex items-center gap-2 text-xs text-zinc-500 font-mono"
              style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <signal.icon className="w-4 h-4" />
              {signal.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3
            className="text-3xl md:text-[4vw] font-black text-white tracking-tight"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            Start Guarding My APIs
          </h3>
          <p className="mt-3 text-zinc-500 text-base">
            Free for 14 days. No credit card. Cancel anytime.
          </p>
          <motion.a
            href="#setup"
            className="inline-block mt-8 px-14 py-6 rounded-xl bg-[#00F0FF] text-[#0A0A0F] font-bold text-lg hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Guarding My APIs →
          </motion.a>
        </motion.div>

        {/* Emotional Ending — Shield */}
        <ShieldDraw />
      </div>

      {/* Footer */}
      <Footer />
    </section>
  );
}

/* Trust Signal Icons */
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 7 3.5-.5 6-3.5 6-7V4L8 1z" />
      <path d="M5.5 8L7.5 10L10.5 6.5" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1" />
      <path d="M5 7V5a3 3 0 016 0v2" />
    </svg>
  );
}

function ShieldGDPRIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 1L2 4v4c0 3.5 2.5 6.5 6 7 3.5-.5 6-3.5 6-7V4L8 1z" />
      <path d="M5.5 6.5h5M5.5 9h3" />
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2" width="9" height="12" rx="1" />
      <path d="M11 5h3v6l-1.5-1L11 11V5z" />
      <path d="M5 6h3M5 9h3" />
    </svg>
  );
}
