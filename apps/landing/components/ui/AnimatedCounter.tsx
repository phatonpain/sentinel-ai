'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ value, duration = 1.5, suffix = '', className }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const rounded = useTransform(spring, (latest) => Math.floor(latest));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  return (
    <motion.span className={className}>
      {display.toLocaleString('en-US')}
      {suffix}
    </motion.span>
  );
}
