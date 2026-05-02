'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AttackCanvasDynamic = dynamic(
  () => import('@/components/neural-grid/AttackCanvas').then((m) => m.AttackCanvas),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

const narrativeTexts = [
  {
    id: 'text-0',
    text: 'Every second, thousands of requests hit your API.',
    style: 'text-white font-normal',
    size: 'text-xl md:text-2xl',
  },
  {
    id: 'text-25',
    text: 'Most pass through unchecked.',
    style: 'text-[#FF6B00] font-bold',
    size: 'text-xl md:text-2xl',
  },
  {
    id: 'text-50',
    text: 'Sentinel detected an anomaly.',
    style: 'text-[#00F0FF] font-bold',
    size: 'text-xl md:text-2xl',
  },
  {
    id: 'text-75',
    text: 'Intercepted in 21ms.',
    style: 'text-white font-black',
    size: 'text-3xl md:text-4xl',
  },
  {
    id: 'text-100',
    text: 'Your API never felt safer.',
    style: 'text-white font-normal italic',
    size: 'text-xl md:text-2xl',
  },
];

const stats = [
  { label: '0% latency impact' },
  { label: '99.96% uptime' },
  { label: 'Zero false positives' },
];

export function Act2_Attack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Main timeline for text transitions
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: pin,
          scrub: 1,
          end: isMobile ? '+=100%' : '+=200%',
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Text 0: visible from 0% to 20%
      tl.fromTo(
        textRefs.current[0],
        { opacity: 1, y: 0 },
        { opacity: 0, y: -20, duration: 0.2 },
        0.15
      );

      // Text 25: fade in at 20%, out at 45%
      tl.fromTo(
        textRefs.current[1],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.2
      );
      tl.to(textRefs.current[1], { opacity: 0, y: -20, duration: 0.15 }, 0.4);

      // Text 50: fade in at 45%, out at 70%
      tl.fromTo(
        textRefs.current[2],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.45
      );
      tl.to(textRefs.current[2], { opacity: 0, y: -20, duration: 0.15 }, 0.7);

      // Text 75: fade in at 70%, out at 90%
      tl.fromTo(
        textRefs.current[3],
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.1 },
        0.7
      );
      tl.to(textRefs.current[3], { opacity: 0, y: -20, duration: 0.1 }, 0.9);

      // Text 100: fade in at 90%
      tl.fromTo(
        textRefs.current[4],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.92
      );

      // Stats: fade in at 95%
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.05 },
        0.95
      );

      // Canvas cinematic exit: scale up + fade down
      tl.fromTo(
        canvasWrapRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.5, opacity: 0.2, duration: 0.1, ease: 'power2.in' },
        0.9
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100vh] md:h-[200vh]">
      {/* Hidden heading for hierarchy */}
      <h2 className="sr-only">The Attack</h2>

      {/* Pinned viewport */}
      <div
        ref={pinRef}
        className="h-screen w-full overflow-hidden bg-[#0A0A0F] flex items-center justify-center"
      >
        {/* Canvas layer */}
        <div ref={canvasWrapRef} className="absolute inset-0 z-0">
          <AttackCanvasDynamic progressRef={progressRef} />
        </div>

        {/* Text overlay layer */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
          {narrativeTexts.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => { textRefs.current[i] = el; }}
              className={`absolute inset-0 flex items-center justify-center ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
            >
              <p
                className={`${item.size} ${item.style} leading-snug tracking-tight`}
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                {item.text}
              </p>
            </div>
          ))}

          {/* Stats */}
          <div
            ref={statsRef}
            className="absolute bottom-[15%] left-0 right-0 flex justify-center gap-8 md:gap-12 opacity-0"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-sm md:text-base text-[#00F0FF] font-mono tracking-wider"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
