'use client';

import { useCallback, useRef } from 'react';

export function useTripleClick(onTripleClick: () => void, threshold = 500) {
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTripleClickRef = useRef(onTripleClick);
  onTripleClickRef.current = onTripleClick;

  const handleClick = useCallback(() => {
    clicksRef.current += 1;

    if (clicksRef.current === 3) {
      clicksRef.current = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
      onTripleClickRef.current();
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clicksRef.current = 0;
    }, threshold);
  }, [threshold]);

  return handleClick;
}
