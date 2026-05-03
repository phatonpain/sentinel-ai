'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface SphereData {
  position: [number, number, number];
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
  size: number;
  color: string;
}

function useDocumentScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

function getZColor(z: number): string {
  const t = Math.min(Math.max((z + 2) / (-6), 0), 1);
  const front = new THREE.Color('#00F0FF');
  const back = new THREE.Color('#001133');
  const result = front.clone().lerp(back, t);
  return `#${result.getHexString()}`;
}

function EnergyPlane({
  mouseRef,
  scrollRef,
  entryRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector3>;
  scrollRef: React.MutableRefObject<number>;
  entryRef: React.MutableRefObject<number>;
}) {
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;
    const scroll = scrollRef.current;
    const entry = entryRef.current;
    const time = state.clock.elapsedTime;

    const baseDistort = 2 * entry * (1 + scroll * 0.5);

    const dx = mouseRef.current.x;
    const dy = mouseRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mouseInfluence = Math.max(0, 1 - dist / 15) * 2.5;

    materialRef.current.distort = baseDistort + mouseInfluence;
    materialRef.current.speed = 2 + scroll * 2;

    meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.02 * entry;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[50, 50, 64, 64]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#00F0FF"
        wireframe
        transparent
        opacity={0.06}
        distort={0}
        speed={2}
      />
    </mesh>
  );
}

function StarField() {
  const count = 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00F0FF" size={0.03} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function SceneContent({
  mouseRef,
  scrollRef,
  entryRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector3>;
  scrollRef: React.MutableRefObject<number>;
  entryRef: React.MutableRefObject<number>;
}) {
  const spheres = useMemo<SphereData[]>(() => {
    const data: SphereData[] = [];
    for (let i = 0; i < 24; i++) {
      const t = Math.random();
      const z = -2 - t * 6;
      data.push({
        position: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, z],
        speed: 1 + Math.random() * 2,
        rotationIntensity: 0.5 + Math.random() * 1.5,
        floatIntensity: 0.5 + Math.random() * 1.5,
        size: 0.06 + (1 - t) * 0.14,
        color: getZColor(z),
      });
    }
    return data;
  }, []);

  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const basePositions = useRef(spheres.map((s) => new THREE.Vector3(...s.position)));
  const velocities = useRef(spheres.map(() => new THREE.Vector3()));
  const lineRef = useRef<THREE.LineSegments>(null);
  const maxLines = spheres.length * spheres.length;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame((_, delta) => {
    const entry = entryRef.current;
    const mouse = mouseRef.current;
    const scroll = scrollRef.current;

    // Update spheres
    for (let i = 0; i < groupRefs.current.length; i++) {
      const group = groupRefs.current[i];
      if (!group) continue;

      const staggerDelay = i * 0.035;
      let staggerEntry = 1;
      if (entry < 1) {
        if (entry <= staggerDelay) {
          staggerEntry = 0;
        } else {
          staggerEntry = Math.min((entry - staggerDelay) / (1 - staggerDelay), 1);
        }
      }

      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.material.opacity = staggerEntry;
        }
      });

      const pos = group.position;
      const basePos = basePositions.current[i];
      const dx = pos.x - mouse.x;
      const dy = pos.y - mouse.y;
      const dz = pos.z - mouse.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 6 && dist > 0.01) {
        const force = ((6 - dist) / 6) * 5;
        velocities.current[i].x += (dx / dist) * force * delta;
        velocities.current[i].y += (dy / dist) * force * delta;
        velocities.current[i].z += (dz / dist) * force * delta;
      }

      velocities.current[i].x += (basePos.x - pos.x) * 2.5 * delta;
      velocities.current[i].y += (basePos.y - pos.y) * 2.5 * delta;
      velocities.current[i].z += (basePos.z - pos.z) * 2.5 * delta;

      velocities.current[i].multiplyScalar(0.94);

      pos.x += velocities.current[i].x * delta;
      pos.y += velocities.current[i].y * delta;
      pos.z += velocities.current[i].z * delta;

      group.rotation.z = Math.sin(i + scroll * Math.PI) * 0.05 * scroll;
    }

    // Update connection lines based on current positions
    if (lineRef.current) {
      const posAttr = lineRef.current.geometry.attributes.position;
      let idx = 0;
      const threshold = 8;

      for (let i = 0; i < groupRefs.current.length; i++) {
        const g1 = groupRefs.current[i];
        if (!g1) continue;
        for (let j = i + 1; j < groupRefs.current.length; j++) {
          const g2 = groupRefs.current[j];
          if (!g2) continue;
          const dx = g1.position.x - g2.position.x;
          const dy = g1.position.y - g2.position.y;
          const dz = g1.position.z - g2.position.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < threshold) {
            linePositions[idx++] = g1.position.x;
            linePositions[idx++] = g1.position.y;
            linePositions[idx++] = g1.position.z;
            linePositions[idx++] = g2.position.x;
            linePositions[idx++] = g2.position.y;
            linePositions[idx++] = g2.position.z;
          }
        }
      }

      for (let k = idx; k < linePositions.length; k++) {
        linePositions[k] = 0;
      }

      posAttr.needsUpdate = true;
      lineRef.current.geometry.setDrawRange(0, idx / 3);
    }
  });

  return (
    <>
      {spheres.map((s, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={s.position}
        >
          <Float speed={s.speed} rotationIntensity={s.rotationIntensity} floatIntensity={s.floatIntensity}>
            <mesh>
              <sphereGeometry args={[s.size, 16, 16]} />
              <meshBasicMaterial color={s.color} transparent opacity={0} />
            </mesh>
          </Float>
        </group>
      ))}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00F0FF" transparent opacity={0.03} />
      </lineSegments>
    </>
  );
}

export function EnergyScene() {
  const { camera, pointer } = useThree();
  const scrollProgress = useDocumentScrollProgress();
  const entryProgress = useRef(0);
  const startedRef = useRef(false);

  const mouseWorld = useRef(new THREE.Vector3());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 2), []);

  useFrame((state) => {
    if (!startedRef.current) {
      startedRef.current = true;
    }
    const elapsed = state.clock.elapsedTime;
    const duration = 2.5;
    const rawT = Math.min(elapsed / duration, 1);
    const t = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;
    entryProgress.current = t;

    const scroll = scrollProgress.current;
    const targetZ = 8 - scroll * 5;
    if (entryProgress.current < 1) {
      const entryZ = 20 - (20 - 8) * entryProgress.current;
      camera.position.z = entryZ;
    } else {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    }

    raycaster.setFromCamera(pointer, camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(mousePlane, intersect)) {
      mouseWorld.current.copy(intersect);
    }
  });

  return (
    <>
      <StarField />
      <EnergyPlane mouseRef={mouseWorld} scrollRef={scrollProgress} entryRef={entryProgress} />
      <SceneContent mouseRef={mouseWorld} scrollRef={scrollProgress} entryRef={entryProgress} />
      <ambientLight intensity={0.5} />
    </>
  );
}
