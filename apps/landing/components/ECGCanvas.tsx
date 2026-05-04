'use client';

import { useEffect, useRef } from 'react';

export function ECGCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = 120;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawGrid = (w: number, h: number) => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const getBeat = (x: number, phase: number) => {
      // Simple ECG-like waveform: flat + P wave + QRS complex + T wave
      const cycle = 200;
      const p = ((x + phase) % cycle) / cycle;
      let y = 0;
      if (p > 0.1 && p < 0.15) y = 8 * Math.sin((p - 0.1) / 0.05 * Math.PI);
      else if (p > 0.18 && p < 0.22) y = -12 * Math.sin((p - 0.18) / 0.04 * Math.PI);
      else if (p > 0.22 && p < 0.26) y = 50 * Math.sin((p - 0.22) / 0.04 * Math.PI);
      else if (p > 0.26 && p < 0.30) y = -20 * Math.sin((p - 0.26) / 0.04 * Math.PI);
      else if (p > 0.30 && p < 0.34) y = 15 * Math.sin((p - 0.30) / 0.04 * Math.PI);
      else if (p > 0.50 && p < 0.58) y = 10 * Math.sin((p - 0.50) / 0.08 * Math.PI);
      return y;
    };

    const animate = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      drawGrid(w, h);

      const centerY = h / 2;
      ctx.beginPath();
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 10;

      for (let x = 0; x < w; x += 1) {
        const noise = (Math.random() - 0.5) * 2;
        const y = centerY + getBeat(x, t) + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      t += 1.5;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mt-16">
      <canvas ref={canvasRef} className="w-full h-[120px] block" />
      <p
        className="text-center text-[12px] text-[#E0E0E0]/40 mt-3"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        Live traffic monitoring
      </p>
    </div>
  );
}
