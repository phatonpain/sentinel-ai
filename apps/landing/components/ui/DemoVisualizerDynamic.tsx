'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DemoVisualizer = dynamic(
  () => import('./DemoVisualizer').then((mod) => mod.DemoVisualizer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
      </div>
    ),
  }
);

interface DemoResult {
  score: number;
  verdict: string;
  headers: string;
  ssl: string;
  vulnerabilities: number;
}

interface Props {
  step: number;
  error: boolean;
  result: DemoResult | null;
}

export function DemoVisualizerDynamic({ step, error, result }: Props) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
        </div>
      }
    >
      <DemoVisualizer step={step} error={error} result={result} />
    </Suspense>
  );
}
