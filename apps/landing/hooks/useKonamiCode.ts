'use client';

import { useEffect, useRef, useCallback } from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(onActivate: () => void) {
  const bufferRef = useRef<string[]>([]);
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    bufferRef.current.push(e.key);
    if (bufferRef.current.length > KONAMI_SEQUENCE.length) {
      bufferRef.current = bufferRef.current.slice(-KONAMI_SEQUENCE.length);
    }
    if (bufferRef.current.join(',') === KONAMI_SEQUENCE.join(',')) {
      bufferRef.current = [];
      onActivateRef.current();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
