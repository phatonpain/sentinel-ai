'use client';

import { useRef, useEffect, useState } from 'react';

interface IconProps {
  color?: string;
  className?: string;
  inView?: boolean;
}

function useSvgDraw(inView?: boolean) {
  const pathRef = useRef<any>(null);
  const [length, setLength] = useState(200);

  useEffect(() => {
    if (pathRef.current && pathRef.current.getTotalLength) {
      setLength(pathRef.current.getTotalLength() + 10);
    }
  }, []);

  const style = inView
    ? {
        strokeDasharray: length,
        strokeDashoffset: 0,
        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {
        strokeDasharray: length,
        strokeDashoffset: length,
        transition: 'stroke-dashoffset 0s',
      };

  return { pathRef, style };
}

export function InspectIcon({ color = '#00F0FF', className, inView }: IconProps) {
  const { pathRef, style } = useSvgDraw(inView);
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} stroke={color} aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Magnifying glass circle */}
      <circle ref={pathRef} cx="50" cy="50" r="32" style={style} />
      {/* Handle */}
      <path d="M74 74 L92 92" style={style} />
      {/* Gear teeth simplified */}
      <circle cx="50" cy="50" r="12" strokeDasharray="4 4" />
      <circle cx="50" cy="50" r="6" />
    </svg>
  );
}

export function ThreatIcon({ color = '#FF6B00', className, inView }: IconProps) {
  const { pathRef, style } = useSvgDraw(inView);
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} stroke={color} aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Shield outline */}
      <path
        ref={pathRef}
        d="M60 12 L100 28 V58 C100 84 60 108 60 108 C60 108 20 84 20 58 V28 Z"
        style={style}
      />
      {/* Pulse wave */}
      <path d="M38 60 Q48 48 60 60 Q72 72 82 60" style={style} />
      <circle cx="60" cy="60" r="4" fill={color} />
    </svg>
  );
}

export function LatencyIcon({ color = '#00F0FF', className, inView }: IconProps) {
  const { pathRef, style } = useSvgDraw(inView);
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} stroke={color} aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Clock circle */}
      <circle ref={pathRef} cx="60" cy="60" r="40" style={style} />
      {/* Clock hands */}
      <path d="M60 60 L60 32" style={style} />
      <path d="M60 60 L78 70" style={style} />
      {/* Lightning bolt */}
      <path d="M85 25 L75 45 L85 45 L70 70" strokeWidth="2.5" />
    </svg>
  );
}

export function ScoreIcon({ color = '#FF6B00', className, inView, value = 94 }: IconProps & { value?: number }) {
  const circleRef = useRef<SVGCircleElement>(null);
  const [circumference, setCircumference] = useState(300);

  useEffect(() => {
    if (circleRef.current) {
      const len = circleRef.current.getTotalLength();
      setCircumference(len);
    }
  }, []);

  const dashOffset = circumference - (circumference * value) / 100;

  const baseStyle = inView
    ? {
        strokeDasharray: circumference,
        strokeDashoffset: dashOffset,
        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
      }
    : {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
        transition: 'stroke-dashoffset 0s',
      };

  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} stroke={color} aria-hidden="true" strokeWidth="2" strokeLinecap="round">
      {/* Background arc */}
      <path d="M20 100 A 50 50 0 1 1 100 100" stroke="rgba(255,255,255,0.1)" />
      {/* Filling arc */}
      <circle
        ref={circleRef}
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke={color}
        strokeWidth="4"
        style={baseStyle}
        strokeDasharray={circumference}
        transform="rotate(135 60 60)"
      />
      {/* Center text */}
      <text x="60" y="68" textAnchor="middle" fill={color} fontSize="24" fontWeight="bold" fontFamily="var(--font-space)">
        {value}
      </text>
    </svg>
  );
}

export function HeaderIcon({ color = '#00F0FF', className, inView }: IconProps) {
  const { pathRef, style } = useSvgDraw(inView);
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} stroke={color} aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Left brace */}
      <path ref={pathRef} d="M42 20 H28 V50 H20 M28 50 H20 V70 H28 M28 70 V100 H42" style={style} />
      {/* Right brace */}
      <path d="M78 20 H92 V50 H100 M92 50 H100 V70 H92 M92 70 V100 H78" style={style} />
      {/* Middle line */}
      <line x1="36" y1="60" x2="84" y2="60" strokeDasharray="3 3" />
    </svg>
  );
}

export function TenantIcon({ color = '#FF6B00', className, inView }: IconProps) {
  const { pathRef, style } = useSvgDraw(inView);
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} stroke={color} aria-hidden="true" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Outer square */}
      <rect ref={pathRef} x="15" y="15" width="90" height="90" rx="4" style={style} />
      {/* Dividers */}
      <line x1="15" y1="60" x2="105" y2="60" />
      <line x1="60" y1="15" x2="60" y2="105" />
      {/* Small dots in compartments */}
      <circle cx="37" cy="37" r="3" fill={color} />
      <circle cx="83" cy="37" r="3" fill={color} />
      <circle cx="37" cy="83" r="3" fill={color} />
      <circle cx="83" cy="83" r="3" fill={color} />
    </svg>
  );
}
