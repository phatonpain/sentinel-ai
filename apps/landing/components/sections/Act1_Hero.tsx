'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import gsap from 'gsap';

const ECGCanvas = dynamic(() => import('@/components/ecg/ECGCanvas'), { ssr: false });
const HeartWireframe = dynamic(() => import('@/components/heart/HeartWireframe'), { ssr: false });

interface Act1HeroProps {
  konamiActive?: boolean;
  invertedTheme?: boolean;
}

export function Act1_Hero({ konamiActive, invertedTheme }: Act1HeroProps) {
  const [bootComplete, setBootComplete] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Boot scanline */}
      <div
        ref={scanlineRef}
        className="fixed top-0 left-0 w-full h-[2px] bg-[#00F0FF] z-50 pointer-events-none"
        style={{ transform: 'translateY(-100%)', boxShadow: '0 0 20px #00F0FF, 0 0 40px #00F0FF' }}
      />

      {/* Inverted theme message */}
      <AnimatePresence>
        {invertedTheme && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 border border-zinc-300 bg-white/90 text-zinc-600 text-xs font-mono"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Light mode? We&apos;re not ready for that.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-12 max-w-6xl mx-auto opacity-0">
        {/* Konami override */}
        <AnimatePresence mode="wait">
          {konamiActive ? (
            <motion.div
              key="konami"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <h1
                className="text-[clamp(48px,8vw,120px)] font-black text-[#FF6B00] tracking-tighter leading-[0.95]"
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                You found the backdoor.
              </h1>
              <p
                className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light font-mono"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                Even the grid bows to you. 999,999 threats neutralized in 0.001ms. 100% uptime.
                <br />
                You are the admin now.
              </p>
              <a
                href="#setup"
                className="mt-10 inline-block border border-[#FF6B00] text-[#FF6B00] font-mono text-sm px-6 py-3 hover:bg-[#FF6B00]/10 transition-all"
              >
                {'> ACCESS_GOD_MODE'}
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="sistole"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 font-mono text-xs text-[#00F0FF] mb-6"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]" />
                </span>
                {'API LIVE IN PRODUCTION'}
              </motion.div>

              {/* Title */}
              <h1
                className="text-[clamp(64px,12vw,144px)] font-bold text-[#FF003C] tracking-tighter leading-none"
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                SISTOLE
              </h1>

              {/* Subtitle */}
              <p
                className="mt-4 text-xs md:text-sm text-[#E0E0E0]/80 font-mono tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                A defesa viva da sua API
              </p>

              {/* ECG + Heart */}
              {bootComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mt-10 w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-8"
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-[#00F0FF]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                        {'>'} SISTOLE_MONITOR
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]" />
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

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#setup"
                  className="inline-block border border-[#00F0FF] text-[#00F0FF] font-mono text-sm px-6 py-3 hover:bg-[#00F0FF]/10 transition-all"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {'> INICIAR_MONITORAMENTO'}
                </a>
                <a
                  href="#docs"
                  className="inline-block border border-[#E0E0E0]/50 text-[#E0E0E0] font-mono text-sm px-6 py-3 hover:bg-[#E0E0E0]/10 transition-all"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {'> VER_DOCUMENTACAO'}
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom scroll indicator */}
      <div className="relative z-10 w-full mt-auto pb-8">
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[#00F0FF]/50 font-mono text-xs"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            <span>[ SCROLL ]</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#00F0FF]/50 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
