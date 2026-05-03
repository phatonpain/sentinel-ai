'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function HeartMesh({ pulse }: { pulse: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);
  const targetScale = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const factor = 1 - Math.abs(x) * 0.3;
      pos.setY(i, y * factor + Math.abs(x) * 0.4);
      pos.setZ(i, z * 0.8);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    if (pulse) {
      targetScale.current = 1.3;
      setTimeout(() => {
        targetScale.current = 1;
      }, 200);
    }
  }, [pulse]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    scaleRef.current += (targetScale.current - scaleRef.current) * delta * 10;
    meshRef.current.scale.setScalar(scaleRef.current);
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0}>
      <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export default function HeartWireframe({ pulse = false }: { pulse?: boolean }) {
  return (
    <div className="w-[300px] h-[300px]" role="img" aria-label="Coração 3D wireframe pulsando em tempo real">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <HeartMesh pulse={pulse} />
      </Canvas>
    </div>
  );
}
