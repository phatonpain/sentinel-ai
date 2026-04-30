'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  show: boolean;
  type: ToastType;
  title: string;
  message: string;
  apiKey?: string;
  onClose: () => void;
}

export function Toast({ show, type, title, message, apiKey, onClose }: ToastProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-sentinel-green" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    info: <CheckCircle2 className="h-5 w-5 text-sentinel-cyan" />,
  };

  const borderColors = {
    success: 'border-sentinel-green/30',
    error: 'border-red-500/30',
    warning: 'border-amber-500/30',
    info: 'border-sentinel-cyan/30',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-[100] max-w-md w-full rounded-xl border ${borderColors[type]} bg-[#0d0d12] p-5 shadow-2xl`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{icons[type]}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <p className="mt-1 text-sm text-slate-400">{message}</p>
              {apiKey && (
                <div className="mt-3 rounded-lg border border-white/10 bg-[#0a0a0f] p-3">
                  <p className="text-xs text-slate-500 mb-1">Your API Key:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-sentinel-cyan font-mono truncate">
                      {apiKey}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 p-1.5 rounded-md hover:bg-white/5 transition-colors"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-sentinel-green" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Use this key in the{' '}
                    <code className="text-slate-400">X-Sentinel-Api-Key</code> header.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
