'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { FeatureCard, features } from '@/components/ui/FeatureCard';

export function Act3_Anatomy() {
  const [titleRef, titleInView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      id="features"
      className="relative z-20 bg-[#0A0A0F]"
      style={{ marginTop: '-20vh', paddingTop: '20vh', contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-32">
        {/* Section title */}
        <div ref={titleRef} className="pt-24 pb-16 md:pb-24">
          <motion.span
            className="text-[#00F0FF] text-xs uppercase tracking-[0.3em] mb-4 block"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Capabilities
          </motion.span>
          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            Security that{' '}
            <span className="text-[#00F0FF]">actually works</span>
          </motion.h2>
        </div>

        {/* Features — alternating layout */}
        <div className="flex flex-col">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              layout={i % 2 === 0 ? 'left' : 'right'}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
