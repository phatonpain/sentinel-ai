'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Broken node visual */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg viewBox="0 0 128 128" className="w-full h-full">
            {/* Grid lines */}
            <line x1="32" y1="32" x2="64" y2="64" stroke="rgba(0,240,255,0.2)" strokeWidth="1" />
            <line x1="96" y1="32" x2="64" y2="64" stroke="rgba(0,240,255,0.2)" strokeWidth="1" />
            <line x1="32" y1="96" x2="64" y2="64" stroke="rgba(0,240,255,0.2)" strokeWidth="1" />
            <line x1="96" y1="96" x2="64" y2="64" stroke="rgba(0,240,255,0.2)" strokeWidth="1" />
            {/* Normal nodes */}
            <circle cx="32" cy="32" r="4" fill="#00F0FF" opacity="0.6" />
            <circle cx="96" cy="32" r="4" fill="#00F0FF" opacity="0.6" />
            <circle cx="32" cy="96" r="4" fill="#00F0FF" opacity="0.6" />
            <circle cx="96" cy="96" r="4" fill="#00F0FF" opacity="0.6" />
            {/* Broken center node */}
            <circle cx="64" cy="64" r="6" fill="#8B0000" opacity="0.8" />
            <line x1="58" y1="58" x2="70" y2="70" stroke="#8B0000" strokeWidth="2" />
            <line x1="70" y1="58" x2="58" y2="70" stroke="#8B0000" strokeWidth="2" />
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-space)' }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-zinc-400 mb-8"
        >
          This endpoint returned 404. Even our grid couldn&apos;t find it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00F0FF] text-[#0A0A0F] font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            Return to Base
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
