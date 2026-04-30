'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from './animated-counter';

export function SocialProof() {
  const stats = [
    { value: 99.9, suffix: '%', label: 'Uptime guaranteed', decimals: 1 },
    { value: 21, suffix: 'ms', label: 'Average latency', decimals: 0 },
    { value: 0, suffix: '', label: 'False positives', decimals: 0, display: '0' },
    { value: 100, suffix: '+', label: 'Threats detected', decimals: 0 },
  ];

  return (
    <section className="relative border-y border-white/5 bg-[#0d0d12]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-12"
        >
          Protecting requests in production
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-white">
                {stat.display ? (
                  stat.display
                ) : (
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Company logos placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-40"
        >
          {['Vercel', 'Stripe', 'Railway', 'Supabase', 'Turso'].map((company) => (
            <div
              key={company}
              className="text-lg font-bold text-slate-500 hover:text-slate-300 transition-colors"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
