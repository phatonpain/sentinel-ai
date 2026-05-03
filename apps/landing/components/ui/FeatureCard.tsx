'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { AnimatedCounter } from './AnimatedCounter';
import { TypewriterText } from './TypewriterText';
import {
  InspectIcon,
  ThreatIcon,
  LatencyIcon,
  ScoreIcon,
  HeaderIcon,
  TenantIcon,
} from './FeatureIcons';

export type FeatureId = 'inspect' | 'threat' | 'latency' | 'score' | 'header' | 'tenant';

interface FeatureData {
  id: FeatureId;
  title: string;
  description: string;
  stat?: string;
  statValue?: number;
  statSuffix?: string;
  codeSnippet?: string;
  color: 'cyan' | 'amber';
  icon: React.FC<{ color?: string; className?: string; inView?: boolean; value?: number }>;
  tooltip: string;
  gaugeValue?: number;
}

export const features: FeatureData[] = [
  {
    id: 'inspect',
    title: 'Inspect Engine',
    description:
      'Deep analysis of headers, SSL/TLS configurations, and payload. Identifies exposure of sensitive data before it leaves the wire.',
    stat: '0.3s avg scan time',
    color: 'cyan',
    icon: InspectIcon,
    tooltip: 'curl -X POST /v1/inspect -H "X-Sentinel-Api-Key: sk_live_..."',
  },
  {
    id: 'threat',
    title: 'Threat Detection',
    description:
      'Detects XSS, SQL Injection, SSRF, Command Injection in real-time. AI behavioral patterns block zero-days without signatures.',
    stat: '99.9% detection rate',
    statValue: 99.9,
    statSuffix: '%',
    color: 'amber',
    icon: ThreatIcon,
    tooltip: 'Zero-day detection via neural behavioral analysis',
  },
  {
    id: 'latency',
    title: 'Ultra-Low Latency',
    description:
      '21ms average latency. Edge-optimized architecture ensures your API is never delayed by security.',
    stat: '21ms',
    statValue: 21,
    statSuffix: 'ms',
    color: 'cyan',
    icon: LatencyIcon,
    tooltip: 'Edge nodes in 42 countries. P99 < 45ms.',
  },
  {
    id: 'score',
    title: 'Security Score',
    description:
      'Score 0-100 with actionable recommendations. Know exactly what needs fixing and the business impact.',
    stat: 'Score: 94/100',
    color: 'amber',
    icon: ScoreIcon,
    tooltip: 'Score based on OWASP Top 10 + custom heuristics',
    gaugeValue: 94,
  },
  {
    id: 'header',
    title: 'One-Header Integration',
    description:
      "One X-Sentinel-Api-Key header and you're done. No SDKs, no complex middlewares. Any stack. Any framework.",
    codeSnippet: 'X-Sentinel-Api-Key: sk_live_...',
    color: 'cyan',
    icon: HeaderIcon,
    tooltip: 'No dependencies. Works with Express, Fastify, NestJS, Rails, Django...',
  },
  {
    id: 'tenant',
    title: 'Multi-Tenant',
    description:
      'Complete separation per client on Enterprise. Each tenant with its own policy, isolated reports, and dedicated egress.',
    stat: '∞ tenants',
    color: 'amber',
    icon: TenantIcon,
    tooltip: 'Tenant isolation via UUID namespace + dedicated DB schemas',
  },
];

const colorMap = {
  cyan: {
    text: 'text-[#00F0FF]',
    border: 'border-[#00F0FF]/20',
    bg: 'bg-[#00F0FF]/5',
    glow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]',
  },
  amber: {
    text: 'text-[#FF6B00]',
    border: 'border-[#FF6B00]/20',
    bg: 'bg-[#FF6B00]/5',
    glow: 'hover:shadow-[0_0_30px_rgba(255,107,0,0.1)]',
  },
};

interface FeatureCardProps {
  feature: FeatureData;
  layout: 'left' | 'right';
  index: number;
}

export function FeatureCard({ feature, layout }: FeatureCardProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [hovered, setHovered] = useState(false);
  const colors = colorMap[feature.color];
  const Icon = feature.icon;

  const isLeft = layout === 'left';

  return (
    <div
      ref={ref}
      className={`feature-card relative flex flex-col md:flex-row items-center gap-8 md:gap-16 py-12 md:py-24 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <motion.div
        className={`relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 rounded-2xl border ${colors.border} ${colors.bg} ${colors.glow} transition-shadow duration-500 flex items-center justify-center`}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        <Icon
          color={feature.color === 'cyan' ? '#00F0FF' : '#FF6B00'}
          className="w-24 h-24 md:w-32 md:h-32"
          inView={inView}
          value={feature.gaugeValue}
        />

        {/* Tooltip */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-30"
          >
            <div
              className="px-4 py-2 rounded-lg border border-[#00F0FF]/30 bg-[#0a0a0f]/90 backdrop-blur-md text-[0.875rem] font-mono text-[#00F0FF] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              {feature.tooltip}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Text */}
      <div className="flex-1 max-w-xl">
        {/* Title — word by word */}
        <motion.h3
          className={`text-3xl md:text-4xl font-bold ${colors.text} mb-4 tracking-tight`}
          style={{ fontFamily: 'var(--font-space), sans-serif' }}
        >
          {feature.title.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
              <motion.span
                className="inline-block"
                initial={{ y: 30, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg text-zinc-400 leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {feature.description}
        </motion.p>

        {/* Stat or Code */}
        {feature.stat && (
          <motion.div
            className={`text-xl md:text-2xl font-bold ${colors.text} font-mono`}
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {feature.statValue !== undefined ? (
              <>
                <AnimatedCounter
                  value={feature.statValue}
                  suffix={feature.statSuffix}
                  duration={1.5}
                />
                {!feature.statSuffix && feature.stat.replace(/^[0-9.]+/, '')}
              </>
            ) : (
              feature.stat
            )}
          </motion.div>
        )}

        {feature.codeSnippet && (
          <motion.div
            className="mt-4 p-4 rounded-lg border border-[#00F0FF]/20 bg-[#00F0FF]/5 font-mono text-sm text-[#00F0FF]"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TypewriterText text={feature.codeSnippet} speed={50} delay={600} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
