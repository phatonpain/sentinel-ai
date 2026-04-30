'use client';

import { motion } from 'framer-motion';
import { Search, ShieldCheck, Zap, BarChart3, Plug, Building2 } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Inspect Engine',
    description:
      'Deep analysis of headers, SSL/TLS configurations and payload. Identifies exposure of sensitive data and insecure configurations in milliseconds.',
    color: 'from-sentinel-purple to-purple-400',
    glow: 'glow-purple',
  },
  {
    icon: ShieldCheck,
    title: 'Threat Detection',
    description:
      'Detect XSS, SQL Injection, SSRF, Command Injection and more in real-time. Our AI analyzes behavioral patterns to block zero-days.',
    color: 'from-sentinel-green to-emerald-400',
    glow: '',
  },
  {
    icon: Zap,
    title: 'Ultra-Low Latency',
    description:
      '21ms average latency. Our edge-optimized architecture ensures your API is never delayed by the security layer.',
    color: 'from-sentinel-cyan to-cyan-400',
    glow: 'glow-cyan',
  },
  {
    icon: BarChart3,
    title: 'Security Score',
    description:
      'Score 0-100 with actionable recommendations. Know exactly what needs to be fixed and the impact of each vulnerability.',
    color: 'from-orange-500 to-amber-400',
    glow: '',
  },
  {
    icon: Plug,
    title: 'Easy Integration',
    description:
      'One X-Sentinel-Api-Key header and you\'re done. No SDKs, no complex middlewares. Works with any stack: Node.js, Python, Go, Ruby.',
    color: 'from-pink-500 to-rose-400',
    glow: '',
  },
  {
    icon: Building2,
    title: 'Multi-Tenant',
    description:
      'Complete separation per client on Enterprise plan. Each tenant with its own policy, whitelist and isolated reports.',
    color: 'from-blue-500 to-indigo-400',
    glow: '',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-sentinel-purple uppercase tracking-widest mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            API security that{' '}
            <span className="gradient-text">works</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400">
            Everything you need to protect your APIs, in a single intelligence layer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-white/5 bg-[#0d0d12] p-6 hover:border-white/10 transition-all duration-300"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sentinel-purple/5 to-sentinel-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
