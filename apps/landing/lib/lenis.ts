import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis smooth scroll.
 * Safe to call multiple times — returns existing instance if already created.
 */
export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenisInstance;
}

/**
 * Get existing Lenis instance (or null if not initialized).
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Destroy Lenis instance.
 */
export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
}
