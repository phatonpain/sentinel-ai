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

  useFrame(() => {
    if (!materialRef.current) return;
    const scroll = scrollRef.current;
    const entry = entryRef.current;

    // Base distort: 0 -> 3 on entry, then grows with scroll
    const baseDistort = 2 * entry * (1 + scroll * 0.5);

    // Mouse proximity increases distort on the energy field
    const dx = mouseRef.current.x;
    const dy = mouseRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mouseInfluence = Math.max(0, 1 - dist / 15) * 2;

    materialRef.current.distort = baseDistort + mouseInfluence;
    materialRef.current.speed = 2 + scroll * 2;
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[50, 50, 32, 32]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#00F0FF"
        wireframe
        transparent
        opacity={0.05}
        distort={0}
        speed={2}
      />
    </mesh>
  );
}

function FloatingSpheres({
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
    for (let i = 0; i < 12; i++) {
      const isFront = Math.random() > 0.5;
      const z = isFront ? -2 - Math.random() * 2 : -6 - Math.random() * 2;
      data.push({
        position: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, z],
        speed: 1 + Math.random() * 2,
        rotationIntensity: 0.5 + Math.random() * 1.5,
        floatIntensity: 0.5 + Math.random() * 1.5,
        size: 0.08 + Math.random() * 0.12,
      });
    }
    return data;
  }, []);

  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const basePositions = useRef(spheres.map((s) => new THREE.Vector3(...s.position)));
  const velocities = useRef(spheres.map(() => new THREE.Vector3()));

  useFrame((_, delta) => {
    const entry = entryRef.current;
    const mouse = mouseRef.current;
    const scroll = scrollRef.current;

    for (let i = 0; i < groupRefs.current.length; i++) {
      const group = groupRefs.current[i];
      if (!group) continue;

      // Staggered cinematic entrance: opacity 0 -> 1
      const staggerDelay = i * 0.04;
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

      // Mouse repulsion (soft)
      const pos = group.position;
      const basePos = basePositions.current[i];
      const dx = pos.x - mouse.x;
      const dy = pos.y - mouse.y;
      const dz = pos.z - mouse.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 5 && dist > 0.01) {
        const force = ((5 - dist) / 5) * 4;
        velocities.current[i].x += (dx / dist) * force * delta;
        velocities.current[i].y += (dy / dist) * force * delta;
        velocities.current[i].z += (dz / dist) * force * delta;
      }

      // Return to base position (elastic)
      velocities.current[i].x += (basePos.x - pos.x) * 2.5 * delta;
      velocities.current[i].y += (basePos.y - pos.y) * 2.5 * delta;
      velocities.current[i].z += (basePos.z - pos.z) * 2.5 * delta;

      // Damping
      velocities.current[i].multiplyScalar(0.94);

      // Apply velocity
      pos.x += velocities.current[i].x * delta;
      pos.y += velocities.current[i].y * delta;
      pos.z += velocities.current[i].z * delta;

      // Scroll adds subtle extra rotation to the group
      group.rotation.z = Math.sin(i + scroll * Math.PI) * 0.05 * scroll;
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
          <Float
            speed={s.speed}
            rotationIntensity={s.rotationIntensity}
            floatIntensity={s.floatIntensity}
          >
            <mesh>
              <sphereGeometry args={[s.size, 16, 16]} />
              <meshBasicMaterial color="#00F0FF" transparent opacity={0} />
            </mesh>
          </Float>
        </group>
      ))}
    </>
  );
}

export function EnergyScene() {
  const { camera, pointer } = useThree();
  const scrollProgress = useDocumentScrollProgress();
  const entryProgress = useRef(0);
  const startedRef = useRef(false);

  // Mouse position in 3D world at Z = -2 (mid-range of spheres)
  const mouseWorld = useRef(new THREE.Vector3());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 2), []);

  useFrame((state) => {
    // Cinematic entry progress: 0 -> 1 in 2.5s with easeInOut
    if (!startedRef.current) {
      startedRef.current = true;
    }
    const elapsed = state.clock.elapsedTime;
    const duration = 2.5;
    const rawT = Math.min(elapsed / duration, 1);
    // easeInOut quad
    const t = rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;
    entryProgress.current = t;

    // Camera: start at Z=20, animate to Z=8, then scroll drives 8 -> 3
    const scroll = scrollProgress.current;
    const targetZ = 8 - scroll * 5; // 8 -> 3
    if (entryProgress.current < 1) {
      const entryZ = 20 - (20 - 8) * entryProgress.current;
      camera.position.z = entryZ;
    } else {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    }

    // Raycast pointer to world plane for mouse interaction
    raycaster.setFromCamera(pointer, camera);
    const intersect = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(mousePlane, intersect)) {
      mouseWorld.current.copy(intersect);
    }
  });

  return (
    <>
      <EnergyPlane mouseRef={mouseWorld} scrollRef={scrollProgress} entryRef={entryProgress} />
      <FloatingSpheres mouseRef={mouseWorld} scrollRef={scrollProgress} entryRef={entryProgress} />
      <ambientLight intensity={0.5} />
    </>
  );
}
