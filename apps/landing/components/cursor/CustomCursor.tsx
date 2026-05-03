'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, [data-cursor-expand]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, [data-cursor-expand]')) {
        setIsHovering(false);
      }
    };

    let animationId: number;
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursor) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform', opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <div
        className={`relative transition-all duration-150 ease-out ${isHovering ? 'scale-150' : 'scale-100'} ${isClicking ? 'scale-75' : ''}`}
      >
        {/* Horizontal */}
        <div
          className="absolute bg-[#00F0FF]"
          style={{
            width: isHovering ? '24px' : '16px',
            height: '1px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.15s ease',
          }}
        />
        {/* Vertical */}
        <div
          className="absolute bg-[#00F0FF]"
          style={{
            width: '1px',
            height: isHovering ? '24px' : '16px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'height 0.15s ease',
          }}
        />
        {/* Centro */}
        <div
          className="absolute bg-[#00F0FF] rounded-full"
          style={{
            width: isHovering ? '6px' : '3px',
            height: isHovering ? '6px' : '3px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.15s ease',
            opacity: isHovering ? 0.5 : 1,
          }}
        />
      </div>
    </div>
  );
}
