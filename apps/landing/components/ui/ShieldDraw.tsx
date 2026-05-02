'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

export function ShieldDraw() {
  const [containerRef, inView] = useInView<HTMLDivElement>({ threshold: 0.5 });
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(300);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength() + 5);
    }
  }, []);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setDone(true), 1600);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center py-24">
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <svg viewBox="0 0 120 140" fill="none" className="w-full h-full">
          {/* Outer shield */}
          <motion.path
            ref={pathRef}
            d="M60 10 L100 25 V65 C100 95 60 130 60 130 C60 130 20 95 20 65 V25 Z"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: length, strokeDashoffset: length }}
            animate={inView ? { strokeDashoffset: 0 } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          {/* Inner chevron */}
          <motion.path
            d="M40 65 L55 80 L80 50"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 }}
            animate={inView ? { strokeDashoffset: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeInOut' }}
          />
          {/* Fill */}
          <motion.path
            d="M60 10 L100 25 V65 C100 95 60 130 60 130 C60 130 20 95 20 65 V25 Z"
            fill="rgba(0, 240, 255, 0.1)"
            initial={{ opacity: 0 }}
            animate={done ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          />
        </svg>

        {/* Pulse */}
        {done && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#00F0FF]/5" />
          </motion.div>
        )}
      </div>

      {/* Fade to black overlay */}
      {done && (
        <motion.div
          className="fixed inset-0 bg-[#0A0A0F] pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
      )}
    </div>
  );
}
