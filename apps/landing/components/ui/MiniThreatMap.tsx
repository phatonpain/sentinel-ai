'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = [
  { x: 28, y: 65, name: 'São Paulo' },
  { x: 22, y: 35, name: 'Nova York' },
  { x: 78, y: 32, name: 'Tóquio' },
  { x: 48, y: 25, name: 'Londres' },
  { x: 50, y: 45, name: 'Berlim' },
  { x: 72, y: 55, name: 'Cingapura' },
  { x: 85, y: 70, name: 'Sydney' },
  { x: 15, y: 28, name: 'Los Angeles' },
  { x: 55, y: 60, name: 'Dubai' },
  { x: 38, y: 40, name: 'Paris' },
];

export function MiniThreatMap({ onClose }: { onClose: () => void }) {
  const [activeDots, setActiveDots] = useState<number[]>([]);

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    CITIES.forEach((_, i) => {
      const interval = setInterval(() => {
        setActiveDots((prev) => {
          if (prev.includes(i)) return prev.filter((d) => d !== i);
          return [...prev, i];
        });
      }, 800 + Math.random() * 1500);
      intervals.push(interval);
    });

    // Auto-close after 5 seconds
    const closeTimer = setTimeout(onClose, 5000);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-full right-0 mb-4 z-50"
      >
        <div
          className="w-[220px] h-[140px] rounded-xl border border-[#00F0FF]/30 bg-[rgba(10,10,15,0.95)] backdrop-blur-md p-3 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          <p
            className="text-[0.65rem] text-[#00F0FF] font-mono uppercase tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Live Attack Map
          </p>
          <svg viewBox="0 0 100 60" className="w-full h-full">
            {/* World map simplified outline */}
            <path
              d="M10 20 Q25 10 40 20 Q55 15 70 25 Q85 20 95 30 Q90 45 75 50 Q55 55 35 50 Q15 55 5 40 Q5 25 10 20Z"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <path
              d="M20 20 Q30 15 35 25 Q30 35 20 30 Q15 25 20 20Z"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
            <path
              d="M50 15 Q65 10 75 20 Q70 35 55 30 Q45 25 50 15Z"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
            <path
              d="M75 35 Q85 30 90 40 Q85 50 75 45 Q70 40 75 35Z"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />

            {/* City dots */}
            {CITIES.map((city, i) => (
              <g key={city.name}>
                <circle cx={city.x} cy={city.y} r="1" fill="rgba(255,255,255,0.2)" />
                {activeDots.includes(i) && (
                  <>
                    <circle cx={city.x} cy={city.y} r="2" fill="#00F0FF">
                      <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="4"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="0.5"
                      opacity="0.4"
                    >
                      <animate attributeName="r" values="2;6" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
