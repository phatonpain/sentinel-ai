'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const lastTimeRef = useRef(Date.now());
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      if (deltaTime < 16) return; // throttle to ~60fps

      const currentScroll = window.scrollY;
      const deltaScroll = Math.abs(currentScroll - lastScrollRef.current);
      const v = (deltaScroll / deltaTime) * 1000; // px/s

      setVelocity(v);
      lastTimeRef.current = now;
      lastScrollRef.current = currentScroll;

      // Reset velocity after a short delay
      setTimeout(() => {
        setVelocity((prev) => (prev === v ? 0 : prev));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return velocity;
}
