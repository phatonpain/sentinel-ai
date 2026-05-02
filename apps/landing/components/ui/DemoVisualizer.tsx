'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { DemoGrid } from './DemoGrid';

interface DemoResult {
  score: number;
  verdict: string;
  headers: string;
  ssl: string;
  vulnerabilities: number;
}

interface DemoVisualizerProps {
  step: number; // 0=idle, 1=absorption, 2=light, 3=analysis, 4=score, 5=result
  error: boolean;
  result: DemoResult | null;
}

export function DemoVisualizer({ step, error, result }: DemoVisualizerProps) {
  const isScanning = step > 0 && step < 5;
  const showResult = step >= 4 && result && !error;
  const showError = error;

  const score = result?.score ?? 85;
  const threats = result?.vulnerabilities ?? 0;

  const badges = [
    { label: 'Headers', value: result?.headers === 'secure' ? 'Safe' : 'Review', ok: result?.headers === 'secure' },
    { label: 'Payload', value: threats === 0 ? 'Clean' : 'Suspicious', ok: threats === 0 },
    { label: 'SSL', value: result?.ssl === 'valid' ? 'Valid' : 'Invalid', ok: result?.ssl === 'valid' },
    { label: 'Threats', value: threats.toString(), ok: threats === 0 },
  ];

  return (
    <div className="relative w-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <DemoGrid step={step} error={showError} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light rays (step 2) */}
      <AnimatePresence>
        {step >= 1 && step < 4 && !showError && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-[1px] bg-gradient-to-r from-[#00F0FF] to-transparent"
                style={{
                  width: '50%',
                  transformOrigin: 'left center',
                  rotate: `${i * 72 - 90}deg`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={step >= 2 ? { scaleX: 1, opacity: [0, 0.8, 0.4] } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central core (step 2+) */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full"
              style={{
                background: error
                  ? 'radial-gradient(circle, rgba(255,0,0,0.4) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, transparent 70%)',
              }}
              animate={
                isScanning && !error
                  ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }
                  : { scale: 1, opacity: 0.8 }
              }
              transition={isScanning ? { duration: 1.5, repeat: Infinity } : {}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center px-6"
          >
            <motion.p
              className="text-xl md:text-2xl font-bold text-red-500 mb-2"
              style={{ fontFamily: 'var(--font-space), sans-serif' }}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 0.5 }}
            >
              Threat detected...
            </motion.p>
            <p className="text-sm md:text-base text-zinc-400">
              in your URL syntax. Try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score revealed (step 4+) */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Big score */}
            <motion.div
              className="relative"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: 'backOut' }}
            >
              <span
                className="text-[clamp(64px,10vw,140px)] font-black leading-none"
                style={{
                  fontFamily: 'var(--font-space), sans-serif',
                  color: score >= 80 ? '#00F0FF' : score >= 50 ? '#FF6B00' : '#FF0000',
                }}
              >
                <AnimatedCounter value={score} suffix="" duration={1.5} />
              </span>
              <span
                className="text-2xl md:text-3xl font-bold text-white/60 ml-2"
                style={{ fontFamily: 'var(--font-space), sans-serif' }}
              >
                /100
              </span>
            </motion.div>

            <p className="text-sm text-zinc-500 mt-2 mb-8 font-mono">
              {result?.verdict === 'ALLOW' ? 'SECURE' : 'REVIEW REQUIRED'}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                  className={`px-4 py-2 rounded-lg border text-sm font-mono ${
                    badge.ok
                      ? 'border-[#00F0FF]/30 text-[#00F0FF] bg-[#00F0FF]/5'
                      : 'border-[#FF6B00]/30 text-[#FF6B00] bg-[#FF6B00]/5'
                  }`}
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {badge.label}: {badge.value}
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <a
                href="#setup"
                className="px-6 py-3 rounded-xl bg-[#00F0FF] text-[#0A0A0F] font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
              >
                See My Full Report →
              </a>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}?score=${score}`;
                  navigator.clipboard.writeText(shareUrl);
                }}
                className="px-6 py-3 rounded-xl border border-[#00F0FF]/30 text-[#00F0FF] font-bold text-sm hover:bg-[#00F0FF]/10 transition-all"
              >
                Share My Score
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
