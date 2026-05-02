'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LineConfig {
  text: string;
  weight: string;
  size: string;
  color: string;
}

const lines: LineConfig[] = [
  { text: 'YOUR API', weight: 'font-black', size: 'text-[clamp(48px,6vw,96px)]', color: 'text-white' },
  { text: 'HAS ENEMIES', weight: 'font-bold', size: 'text-[clamp(48px,6vw,96px)]', color: 'text-[#FF6B00]' },
  { text: 'WE SEE THEM', weight: 'font-normal', size: 'text-[clamp(40px,5vw,80px)]', color: 'text-[#00F0FF]' },
  { text: 'IN 21MS', weight: 'font-black', size: 'text-[clamp(64px,8vw,128px)]', color: 'text-[#FF6B00]' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function KineticText() {
  const reduced = useReducedMotion();

  return (
    <motion.h1
      className="flex flex-col items-center text-center leading-[0.95] tracking-tighter"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ fontFamily: 'var(--font-space), sans-serif' }}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className={`block ${line.size} ${line.weight} ${line.color}`}>
          {line.text.split(' ').map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block overflow-hidden mx-[0.15em]">
              <motion.span
                className="inline-block"
                variants={reduced ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } } : wordVariants}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}
