'use client';

import dynamic from 'next/dynamic';

export const EnergyFieldDynamic = dynamic(
  () => import('./EnergyField').then((m) => m.EnergyField),
  { ssr: false }
);
