'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KineticText } from '@/components/ui/KineticText';
import { EnergyFieldLazy } from '@/components/energy-field/EnergyFieldLazy';
import { GlassButton } from '@/components/ui/GlassButton';
import { MarqueeLogos } from '@/components/ui/MarqueeLogos';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useLongHover } from '@/hooks/useLongHover';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import ECGCanvas from '@/components/ecg/ECGCanvas';

const MiniThreatMap = dynamic(() => import('@/components/ui/MiniThreatMap').then((m) => m.MiniThreatMap), { ssr: false });
const HeartWireframe = dynamic(() => import('@/components/heart/HeartWireframe'), { ssr: false });

interface Act1HeroProps {
  konamiActive?: boolean;
  invertedTheme?: boolean;
}

function LiveThreatBadge({ konamiActive }: { konamiActive?: boolean }) {
  const [count, setCount] = useState(konamiActive ? 999999 : 1247);
  const { active: mapActive, onMouseEnter, onMouseLeave } = useLongHover(5000);

  useEffect(() => {
    if (konamiActive) {
      setCount(999999);
      return;
    }
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [konamiActive]);

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex items-center gap-2 text-[0.875rem] font-mono text-[#00F0FF] mt-8 cursor-help"
        style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]" />
        </span>
        <span>LIVE THREAT MAP</span>
        <span className="text-white/30">—</span>
        <AnimatedCounter value={count} suffix="" className="tabular-nums" />
        <span className="text-white/60">attacks blocked today</span>
      </motion.div>

      {/* Mini Threat Map on long hover */}
      <AnimatePresence>
        {mapActive && (
          <MiniThreatMap onClose={onMouseLeave} />
        )}
      </AnimatePresence>
    </div>
  );
}

export function Act1_Hero({ konamiActive, invertedTheme }: Act1HeroProps) {
  const [heartPulse, setHeartPulse] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scanlineRef.current || !contentRef.current) return;
    const tl = gsap.timeline();
    tl.set(scanlineRef.current, { y: '-100%' })
      .to(scanlineRef.current, { y: '100vh', duration: 1.5, ease: 'power2.inOut' })
      .to(contentRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .add(() => setBootComplete(true));
    return () => { tl.kill(); };
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-proxy-production-28ff.up.railway.app';

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Boot scanline */}
      <div
        ref={scanlineRef}
        className="absolute top-0 left-0 w-full h-[2px] bg-secondary z-50 pointer-events-none"
        style={{ transform: 'translateY(-100%)', boxShadow: '0 0 20px #00F0FF, 0 0 40px #00F0FF' }}
      />

      {/* Immersive Background — 2D first, 3D crossfade on desktop */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          filter: konamiActive ? 'hue-rotate(140deg) saturate(4) brightness(1.3)' : 'none',
        }}
      >
        <EnergyFieldLazy />
      </div>

      {/* Vignette overlay for cinematic depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{ boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)' }}
      />

      {/* Noise/grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-[6] noise opacity-30" />

      {/* Inverted theme message */}
      <AnimatePresence>
        {invertedTheme && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg border border-zinc-300 bg-white/90 text-zinc-600 text-xs font-mono"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Light mode? We&apos;re not ready for that.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content floats above WebGL */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-12 max-w-6xl mx-auto opacity-0">
        {/* Kinetic Headline — overrides on konami */}
        <AnimatePresence mode="wait">
          {konamiActive ? (
            <motion.h1
              key="konami-headline"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-[clamp(48px,8vw,120px)] font-black text-[#FF6B00] tracking-tighter leading-[0.95]"
              style={{ fontFamily: 'var(--font-space), sans-serif' }}
            >
              You found the backdoor.
            </motion.h1>
          ) : (
            <KineticText key="normal-headline" />
          )}
        </AnimatePresence>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light"
          style={{ fontFamily: 'var(--font-space), sans-serif' }}
        >
          {konamiActive
            ? 'Even the grid bows to you. 999,999 threats neutralized in 0.001ms. 100% uptime.'
            : 'Neural Defense Grid intercepts XSS, SQL Injection, and SSRF before the request lands.'}
          <br className="hidden md:block" />
          {konamiActive ? 'You are the admin now.' : 'Zero config. One header.'}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <GlassButton href="#setup" variant="filled">
            {konamiActive ? 'Access God Mode →' : 'Initialize My Defense →'}
          </GlassButton>
        </motion.div>

        {/* Live Threat Badge */}
        <LiveThreatBadge konamiActive={konamiActive} />

        {/* SISTOLE: ECG + Heart */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12 w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-secondary">{'>'} SISTOLE_MONITOR</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
              </div>
              <ECGCanvas
                apiUrl={apiUrl}
                onHeartbeat={(isAttack) => setHeartPulse(isAttack)}
              />
            </div>
            <div className="hidden md:flex items-center justify-center">
              <HeartWireframe pulse={heartPulse} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom elements */}
      <div className="relative z-10 w-full mt-auto">
        {/* Scroll Indicator */}
        <div className="flex justify-center pb-6">
          <ScrollIndicator />
        </div>

        {/* Marquee Logos */}
        <MarqueeLogos />
      </div>
    </section>
  );
}
