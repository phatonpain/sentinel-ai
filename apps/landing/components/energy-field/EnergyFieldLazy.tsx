'use client';

import { useEffect, useRef, useState } from 'react';
import { NeuralCanvas } from '@/components/neural-grid/NeuralCanvas';
import dynamic from 'next/dynamic';

const EnergyFieldDynamic = dynamic(
  () => import('./EnergyField').then((m) => m.EnergyField),
  { ssr: false }
);

export function EnergyFieldLazy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Hero entrou no viewport — tenta carregar 3D quando ocioso
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(
              () => setShouldLoad3D(true),
              { timeout: 2000 }
            );
          } else {
            // Fallback para browsers sem requestIdleCallback
            setTimeout(() => setShouldLoad3D(true), 200);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {/* Fallback 2D imediato — leve, já existe no projeto */}
      {!shouldLoad3D && <NeuralCanvas />}

      {/* 3D só entra quando o navegador estiver ocioso e o hero visível */}
      {shouldLoad3D && <EnergyFieldDynamic />}
    </div>
  );
}
