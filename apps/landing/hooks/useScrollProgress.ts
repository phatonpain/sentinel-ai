'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Returns scroll progress (0 to 1) for a given element ref.
 * Uses IntersectionObserver for performance.
 */
export function useScrollProgress<T extends HTMLElement>(): [React.RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const handleScroll = () => {
              const rect = el.getBoundingClientRect();
              const windowHeight = window.innerHeight;
              const elementHeight = rect.height;
              const scrolled = windowHeight - rect.top;
              const total = windowHeight + elementHeight;
              const p = clamp(scrolled / total, 0, 1);
              setProgress(p);
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
            return () => window.removeEventListener('scroll', handleScroll);
          }
        });
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, progress];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
