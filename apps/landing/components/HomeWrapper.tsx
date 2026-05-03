'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Navbar } from '@/components/ui/Navbar';
import { Act1_Hero } from '@/components/sections/Act1_Hero';
import { Act2_Attack } from '@/components/sections/Act2_Attack';
import { Act3_Anatomy } from '@/components/sections/Act3_Anatomy';
import { Act4_Demo } from '@/components/sections/Act4_Demo';
import { Act5_Pricing } from '@/components/sections/Act5_Pricing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionsProps {
  prefersReducedMotion: boolean;
  konamiActive: boolean;
  invertedTheme: boolean;
  onTripleClick: () => void;
}

function ScrollSections({ prefersReducedMotion, konamiActive, invertedTheme, onTripleClick }: ScrollSectionsProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!mainRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.scroll-section');
    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        // Fade + slide up on enter
        gsap.fromTo(
          section,
          { opacity: 0.8, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Scanline sweep
        const scanLine = document.createElement('div');
        scanLine.className = 'pointer-events-none absolute left-0 w-full h-[2px] z-10 opacity-0';
        scanLine.style.background = 'linear-gradient(90deg, transparent, #00F0FF, transparent)';
        section.style.position = 'relative';
        section.appendChild(scanLine);

        gsap.to(scanLine, {
          top: '100%',
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true,
          },
          ease: 'none',
        });
      });

      // Stagger feature cards
      const cards = gsap.utils.toArray<HTMLElement>('.feature-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Pricing cards stagger
      const pricingCards = gsap.utils.toArray<HTMLElement>('.pricing-card');
      gsap.fromTo(
        pricingCards,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.pricing-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, mainRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={mainRef}>
      <Navbar onTripleClickLogo={onTripleClick} />
      <div className="scroll-section">
        <Act1_Hero konamiActive={konamiActive} invertedTheme={invertedTheme} />
      </div>
      <div className="scroll-section">
        <Act2_Attack />
      </div>
      <div className="scroll-section">
        <Act3_Anatomy />
      </div>
      <div className="scroll-section">
        <Act4_Demo />
      </div>
      <div className="scroll-section pricing-section">
        <Act5_Pricing />
      </div>
    </div>
  );
}

export function HomeWrapper() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [invertedTheme, setInvertedTheme] = useState(false);
  const velocity = useScrollVelocity();
  const isOnline = useOnlineStatus();
  const prefersReducedMotion = useReducedMotion();

  // Konami Code
  useKonamiCode(() => {
    setKonamiActive(true);
    setTimeout(() => setKonamiActive(false), 5000);
  });

  // Triple click handler passed to Navbar
  const handleTripleClick = useCallback(() => {
    setInvertedTheme(true);
    setTimeout(() => setInvertedTheme(false), 2000);
  }, []);

  // Warp speed skew
  const isWarpSpeed = velocity > 5000 && typeof window !== 'undefined' && window.innerWidth >= 768;

  // Theme classes
  const themeClass = invertedTheme
    ? 'bg-[#F5F5F5] text-[#0A0A0F]'
    : 'bg-[#0A0A0F] text-white';

  return (
    <>
      {/* Konami flash overlay */}
      {konamiActive && (
        <div className="fixed inset-0 bg-[#FFD700]/30 pointer-events-none z-[100] animate-pulse" />
      )}

      {/* Offline overlay */}
      {!isOnline && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] px-6 py-3 rounded-xl border border-[#FF6B00]/30 bg-[#0A0A0F]/95 backdrop-blur-md">
          <p
            className="text-sm font-bold text-[#FF6B00] text-center"
            style={{ fontFamily: 'var(--font-space), sans-serif' }}
          >
            Connection lost. Defense grid offline.
          </p>
        </div>
      )}

      <main
        id="main-content"
        className={`min-h-screen overflow-x-hidden transition-all duration-500 ${themeClass}`}
        style={{
          transform: isWarpSpeed ? 'skewY(3deg)' : 'skewY(0deg)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s, color 0.5s',
        }}
      >
        <ScrollSections
          prefersReducedMotion={prefersReducedMotion}
          konamiActive={konamiActive}
          invertedTheme={invertedTheme}
          onTripleClick={handleTripleClick}
        />
      </main>
    </>
  );
}
