'use client';

import { Canvas } from '@react-three/fiber';
import { EnergyScene } from './EnergyScene';

export function EnergyField() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <EnergyScene />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
