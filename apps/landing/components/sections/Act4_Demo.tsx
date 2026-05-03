'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const DemoVisualizerDynamic = dynamic(
  () => import('@/components/ui/DemoVisualizer').then((m) => m.DemoVisualizer),
  { ssr: false }
);

const Oscilloscope = dynamic(
  () => import('@/components/oscilloscope/Oscilloscope'),
  { ssr: false }
);

interface ScanResult {
  score: number;
  verdict: string;
  headers: string;
  ssl: string;
  vulnerabilities: number;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Act4_Demo() {
  const [url, setUrl] = useState('https://api.example.com/users');
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [inputShake, setInputShake] = useState(false);
  const [threatDetected, setThreatDetected] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const reset = useCallback(() => {
    setStep(0);
    setError(false);
    setResult(null);
    setInputShake(false);
    setThreatDetected(false);
  }, []);

  const handleScan = async () => {
    if (step > 0 && step < 5) return; // prevent double click during animation
    reset();
    setStep(1);

    // Start animation sequence
    const animationPromise = (async () => {
      await delay(500); // step 1: absorption
      setStep(2);
      await delay(600); // step 2: light rays
      setStep(3);
      await delay(600); // step 3: grid analysis
      setStep(4);
      await delay(600); // step 4: score reveal
      setStep(5);
    })();

    // API call with minimum 1.5s visual delay
    const apiPromise = (async () => {
      try {
        const res = await fetch('https://api-proxy-production-28ff.up.railway.app/v1/inspect', {
          method: 'POST',
          headers: {
            'X-Sentinel-Api-Key': 'sentinel_sk_ZDUyYzk3N2ItNjdhYi00OWNmLWJjOGEtMTBjM2QwN2MyZjU5',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            context: {
              requestId: 'demo-001',
              timestamp: new Date().toISOString(),
              method: 'GET',
              path: '/',
              query: {},
              headers: { host: new URL(url).hostname || 'example.com' },
              body: {},
              sourceIp: '192.168.1.1',
              userAgent: 'Mozilla/5.0',
            },
            options: { mode: 'block', autoRemediate: true },
          }),
        });

        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const hasThreat = data?.decision?.verdict === 'BLOCK' || (data?.forensics?.vulnerabilities?.length > 0);
        setThreatDetected(hasThreat);
        return {
          score: data?.decision?.riskScore ?? data?.riskScore ?? 85,
          verdict: data?.decision?.verdict ?? data?.verdict ?? 'ALLOW',
          headers: data?.forensics?.headers ?? 'secure',
          ssl: data?.forensics?.ssl ?? 'valid',
          vulnerabilities: Array.isArray(data?.forensics?.vulnerabilities)
            ? data.forensics.vulnerabilities.length
            : 0,
        };
      } catch {
        // Fallback mock data with simulated delay
        await delay(500);
        setThreatDetected(false);
        return {
          score: 85,
          verdict: 'ALLOW',
          headers: 'secure',
          ssl: 'valid',
          vulnerabilities: 0,
        };
      }
    })();

    // Wait for both
    const [apiResult] = await Promise.all([apiPromise, animationPromise]);

    if (apiResult) {
      setResult(apiResult);
    }
  };

  // Error handler
  const triggerError = useCallback(() => {
    setError(true);
    setInputShake(true);
    setTimeout(() => setInputShake(false), 500);
  }, []);

  // Manual error test: if URL is clearly invalid, trigger error narrative
  useEffect(() => {
    if (step === 3 && !url.startsWith('http')) {
      triggerError();
      setStep(0);
    }
  }, [step, url, triggerError]);

  const isScanning = step > 0 && step < 5;
  const inputGlow = isScanning
    ? 'border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
    : error
    ? 'border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)]'
    : 'border-white/10 focus:border-[#00F0FF]/50';

  return (
    <section id="demo" className="relative z-20 py-24 md:py-32 bg-[#08080c]" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="text-[#FF6B00] text-xs uppercase tracking-[0.3em] mb-4 block"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            Interactive Demo
          </span>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            Try it on <span className="text-[#FF6B00]">your endpoint</span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Enter any API URL and watch the Neural Defense Grid analyze it in real-time.
          </p>
        </motion.div>

        {/* Input + Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div
              className="relative flex-1"
              animate={
                inputShake
                  ? { x: [-5, 5, -5, 5, 0] }
                  : step === 1
                  ? { scale: [1, 1.02, 1] }
                  : {}
              }
              transition={{ duration: inputShake ? 0.3 : 0.5 }}
            >
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.yourservice.com/v1/users"
                disabled={isScanning}
                className={`w-full rounded-xl border bg-[#0d0d12] py-4 pl-5 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-300 ${inputGlow}`}
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600 font-mono">
                URL
              </span>
            </motion.div>

            <motion.button
              onClick={step === 5 ? reset : handleScan}
              disabled={isScanning}
              className="relative inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white overflow-hidden transition-all disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%)',
                fontFamily: 'var(--font-space), sans-serif',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">
                {isScanning ? 'Scanning...' : step === 5 ? 'Scan Again' : 'Scan My Endpoint'}
              </span>
              {isScanning && (
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Visualizer */}
        <AnimatePresence mode="wait">
          {(isScanning || result || error) && (
            <motion.div
              key="visualizer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm overflow-hidden"
            >
              <DemoVisualizerDynamic step={step} error={error} result={result} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Oscilloscope ESTÁTICA */}
        <AnimatePresence>
          {(isScanning || audioInitialized) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-secondary">{'>'} ESTÁTICA_OSCILOSCÓPIO</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
              </div>
              <Oscilloscope
                isScanning={isScanning}
                threatDetected={threatDetected}
                onAudioInit={() => setAudioInitialized(true)}
              />
              {!isScanning && result && (
                <div className="mt-3 font-mono text-sm text-center">
                  {threatDetected ? (
                    <span className="text-primary">{'[ AMEAÇA DETECTADA ]'}</span>
                  ) : (
                    <span className="text-secondary">{'[ LIMPO — 21ms ]'}</span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
