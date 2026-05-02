'use client';

import { motion } from 'framer-motion';

const logos = [
  'VERCEL',
  'STRIPE',
  'LINEAR',
  'NOTION',
  'RAILWAY',
  'SUPABASE',
];

export function MarqueeLogos() {
  // Duplicate for seamless loop
  const items = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden py-6 border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#020204] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020204] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-16 items-center whitespace-nowrap hover:[animation-play-state:paused]"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-lg md:text-xl font-bold tracking-widest text-white/30 grayscale hover:grayscale-0 hover:text-[#00F0FF] transition-all duration-300 cursor-default select-none"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
