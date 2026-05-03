'use client';

import { useEffect, useRef, useState } from 'react';
import { NeuralCanvas } from '@/components/neural-grid/NeuralCanvas';
import dynamic from 'next/dynamic';

const EnergyFieldDynamic = dynamic(
  () => import('./EnergyField').then((m) => m.EnergyField),
  { ssr: false }
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function EnergyFieldLazy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [threeDFadedIn, setThreeDFadedIn] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const enable3D = !isMobile && !reducedMotion;

  useEffect(() => {
    if (!enable3D) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => setShouldLoad3D(true), { timeout: 2000 });
          } else {
            setTimeout(() => setShouldLoad3D(true), 200);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enable3D]);

  useEffect(() => {
    if (shouldLoad3D) {
      const timer = setTimeout(() => setThreeDFadedIn(true), 100);
      return () => clearTimeout(timer);
    }
  }, [shouldLoad3D]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {/* Fallback 2D — immediate, lightweight */}
      <div className="absolute inset-0 w-full h-full">
        <NeuralCanvas />
      </div>

      {/* 3D layer with crossfade */}
      {shouldLoad3D && (
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: threeDFadedIn ? 1 : 0 }}
        >
          <EnergyFieldDynamic />
        </div>
      )}
    </div>
  );
}
