'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Lock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Toast } from './toast';

export function InteractiveDemo() {
  const [url, setUrl] = useState('https://api.example.com/users');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    verdict: string;
    headers: string;
    ssl: string;
    vulnerabilities: number;
    forensics?: Record<string, unknown>;
    riskScore?: number;
  }>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({ show: false, type: 'error', title: '', message: '' });

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null);

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
            timestamp: '2026-04-30T00:00:00Z',
            method: 'GET',
            path: '/',
            query: {},
            headers: { host: 'example.com' },
            body: {},
            sourceIp: '192.168.1.1',
            userAgent: 'Mozilla/5.0',
          },
          options: { mode: 'block', autoRemediate: true },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          score: data?.decision?.riskScore ?? data?.riskScore ?? 85,
          verdict: data?.decision?.verdict ?? data?.verdict ?? 'ALLOW',
          headers: data?.forensics?.headers ?? 'secure',
          ssl: data?.forensics?.ssl ?? 'valid',
          vulnerabilities: Array.isArray(data?.forensics?.vulnerabilities)
            ? data.forensics.vulnerabilities.length
            : 0,
          forensics: data?.forensics,
          riskScore: data?.decision?.riskScore ?? data?.riskScore,
        });
      } else {
        setToast({
          show: true,
          type: 'error',
          title: 'Demo Error',
          message: 'Demo requires valid API key',
        });
      }
    } catch {
      setToast({
        show: true,
        type: 'error',
        title: 'Network Error',
        message: 'Demo requires valid API key',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <section id="demo" className="relative py-24 bg-[#0d0d12]">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-sentinel-cyan uppercase tracking-widest mb-4">
              Interactive Demo
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Test real-time <span className="gradient-text">analysis</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/5 bg-[#0a0a0f] p-6 sm:p-8"
          >
            {/* Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/users"
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d12] py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sentinel-purple/50 transition-colors"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sentinel-purple to-sentinel-cyan px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Analyze Now
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Score */}
                    <div className="rounded-xl border border-white/5 bg-[#0d0d12] p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChartIcon score={result.score} />
                        <span className="text-sm text-slate-400">Security Score</span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {result.score}/100
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-sentinel-green to-sentinel-cyan"
                        />
                      </div>
                    </div>

                    {/* Verdict */}
                    <div className="rounded-xl border border-white/5 bg-[#0d0d12] p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-4 w-4 text-sentinel-green" />
                        <span className="text-sm text-slate-400">Verdict</span>
                      </div>
                      <div className="text-3xl font-bold text-sentinel-green">
                        {result.verdict}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Secure request</p>
                    </div>

                    {/* SSL */}
                    <div className="rounded-xl border border-white/5 bg-[#0d0d12] p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="h-4 w-4 text-sentinel-cyan" />
                        <span className="text-sm text-slate-400">SSL/TLS</span>
                      </div>
                      <div className="text-3xl font-bold text-sentinel-cyan capitalize">
                        {result.ssl}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Valid certificate</p>
                    </div>

                    {/* Vulnerabilities */}
                    <div className="rounded-xl border border-white/5 bg-[#0d0d12] p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-sentinel-green" />
                        <span className="text-sm text-slate-400">Vulnerabilities</span>
                      </div>
                      <div className="text-3xl font-bold text-sentinel-green">
                        {result.vulnerabilities}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">None found</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}

function BarChartIcon({ score }: { score: number }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className="w-1 rounded-sm"
          style={{
            height: `${bar * 25}%`,
            backgroundColor: score >= bar * 25 ? '#10b981' : '#334155',
          }}
        />
      ))}
    </div>
  );
}
