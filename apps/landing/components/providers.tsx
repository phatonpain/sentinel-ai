'use client';

import { useEffect, useRef } from 'react';
import { initLenis, destroyLenis } from '@/lib/lenis';

/**
 * Global providers wrapper.
 * Initializes Lenis smooth scroll on mount.
 * Respects prefers-reduced-motion.
 * Reacts to changes in motion preference during session.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const motionMqlRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMqlRef.current = mql;

    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const prefersReduced = 'matches' in e ? e.matches : false;

      if (prefersReduced) {
        destroyLenis();
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
      } else {
        initLenis();
        document.documentElement.classList.add('lenis', 'lenis-smooth');
      }
    };

    handleMotionChange(mql);
    mql.addEventListener('change', handleMotionChange);

    return () => {
      mql.removeEventListener('change', handleMotionChange);
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
