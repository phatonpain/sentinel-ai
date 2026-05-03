'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
        <EffectComposer>
          <Bloom intensity={0.4} luminanceThreshold={0.85} luminanceSmoothing={0.5} radius={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
