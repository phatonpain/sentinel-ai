'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GlassButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'filled' | 'outline';
  className?: string;
  external?: boolean;
}

export function GlassButton({
  href,
  children,
  variant = 'filled',
  className,
  external = false,
}: GlassButtonProps) {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center gap-2',
    'min-h-[44px] min-w-[44px] px-8 py-4',
    'rounded-xl font-bold text-sm md:text-base',
    'transition-transform duration-300 ease-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]',
    variant === 'filled' && [
      'bg-[#00F0FF] text-[#0A0A0F]',
      'hover:scale-105',
      'glow-pulse',
    ],
    variant === 'outline' && [
      'border border-white/10 text-white',
      'hover:border-[#00F0FF]/50 hover:text-[#00F0FF]',
    ],
    className
  );

  const content = (
    <motion.span
      className={baseClasses}
      whileHover={{ scale: variant === 'filled' ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}
