'use client';

import { useState, useCallback } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Navbar } from '@/components/ui/Navbar';
import { Act1_Hero } from '@/components/sections/Act1_Hero';
import { Act2_Attack } from '@/components/sections/Act2_Attack';
import { Act3_Anatomy } from '@/components/sections/Act3_Anatomy';
import { Act4_Demo } from '@/components/sections/Act4_Demo';
import { Act5_Pricing } from '@/components/sections/Act5_Pricing';

export function HomeWrapper() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [invertedTheme, setInvertedTheme] = useState(false);
  const velocity = useScrollVelocity();
  const isOnline = useOnlineStatus();

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
        <Navbar onTripleClickLogo={handleTripleClick} />
        <Act1_Hero konamiActive={konamiActive} invertedTheme={invertedTheme} />
        <Act2_Attack />
        <Act3_Anatomy />
        <Act4_Demo />
        <Act5_Pricing />
      </main>
    </>
  );
}
