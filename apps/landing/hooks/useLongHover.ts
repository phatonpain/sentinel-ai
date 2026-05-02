'use client';

import { useState, useRef, useCallback } from 'react';

export function useLongHover(duration = 5000) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setActive(true);
    }, duration);
  }, [duration]);

  const onMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActive(false);
  }, []);

  return { active, onMouseEnter, onMouseLeave };
}
