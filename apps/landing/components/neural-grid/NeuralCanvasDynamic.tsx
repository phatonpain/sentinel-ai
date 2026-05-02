'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const NeuralCanvas = dynamic(() => import('./NeuralCanvas').then((mod) => mod.NeuralCanvas), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#0A0A0F]">
      <div className="flex items-center justify-center h-full">
        <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
      </div>
    </div>
  ),
});

export function NeuralCanvasDynamic() {
  return (
    <Suspense fallback={null}>
      <NeuralCanvas />
    </Suspense>
  );
}
