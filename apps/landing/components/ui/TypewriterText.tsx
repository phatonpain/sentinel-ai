'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 40,
  delay = 0,
  className,
  showCursor = true,
}: TypewriterTextProps) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {display}
      {showCursor && !done && (
        <span className="inline-block w-[2px] h-[1em] bg-[#00F0FF] ml-[1px] animate-pulse align-middle" />
      )}
    </span>
  );
}
