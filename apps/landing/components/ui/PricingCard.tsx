'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PricingCardProps {
  variant: 'free' | 'pro' | 'enterprise';
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  delay?: number;
}

const variants = {
  free: {
    wrapper: 'relative z-0',
    card: 'bg-white/[0.02] border-white/10 rounded-2xl p-8',
    priceColor: 'text-white',
    checkColor: 'text-zinc-500',
    cta: 'border border-white/20 text-white hover:border-[#00F0FF] hover:text-[#00F0FF] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]',
    align: 'items-start',
  },
  pro: {
    wrapper: 'relative z-10 md:-mt-4 md:mb-4',
    card: 'bg-[rgba(0,240,255,0.03)] border-[rgba(0,240,255,0.2)] rounded-3xl p-10 shadow-[0_0_40px_rgba(0,240,255,0.15)]',
    priceColor: 'text-[#FF6B00]',
    checkColor: 'text-[#00F0FF]',
    cta: 'bg-[#00F0FF] text-[#0A0A0F] hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]',
    align: 'items-center',
  },
  enterprise: {
    wrapper: 'relative z-0',
    card: 'bg-[rgba(255,107,0,0.02)] border-[rgba(255,107,0,0.2)] rounded-2xl p-8',
    priceColor: 'text-[#FF6B00]',
    checkColor: 'text-[#FF6B00]',
    cta: 'border border-[#FF6B00]/40 text-[#FF6B00] hover:bg-[#FF6B00]/10 hover:text-white',
    align: 'items-start',
  },
};

export function PricingCard({
  variant,
  name,
  badge,
  price,
  period,
  description,
  features,
  cta,
  href,
  delay = 0,
}: PricingCardProps) {
  const style = variants[variant];
  const isPro = variant === 'pro';

  return (
    <motion.div
      className={`pricing-card flex flex-col ${style.wrapper}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          className="flex justify-center mb-4"
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span
            className="px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] text-[0.75rem] font-mono tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            {badge}
          </span>
        </motion.div>
      )}

      {isPro && (
        <div
          className="absolute -inset-1 bg-[#00F0FF]/20 rounded-3xl blur-xl opacity-75 animate-pulse-glow pointer-events-none"
        />
      )}
      <div className={`${style.card} flex flex-col h-full transition-all duration-500 relative`}>
        {isPro && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFB800] text-[#0A0A0F] font-mono text-xs px-3 py-1 z-10">
            {'> MAIS_USADO'}
          </div>
        )}
        {/* Name */}
        <span
          className="text-sm text-zinc-500 uppercase tracking-widest mb-4"
          style={{ fontFamily: 'var(--font-space), sans-serif' }}
        >
          {name}
        </span>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span
            className={`text-4xl md:text-5xl font-black ${style.priceColor}`}
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            {price}
          </span>
          {period && (
            <span className="text-base font-light text-zinc-500">{period}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-400 mb-8">{description}</p>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${style.checkColor}`} strokeWidth={2} />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={href}
          className={`block w-full text-center py-3 rounded-xl font-bold transition-all duration-300 ${style.cta}`}
          style={{ fontFamily: 'var(--font-space), sans-serif' }}
        >
          {cta}
        </a>
      </div>
    </motion.div>
  );
}
