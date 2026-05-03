'use client';

import { useRef, useEffect, useCallback } from 'react';

interface ECGCanvasProps {
  apiUrl: string;
  onHeartbeat?: (isAttack: boolean) => void;
}

const COLOR_NORMAL = '#00F0FF';
const COLOR_ATTACK = '#FF003C';
const COLOR_BG = '#0A0A0F';
const LINE_WIDTH = 2;
const AMPLITUDE = 40;

export default function ECGCanvas({ apiUrl, onHeartbeat }: ECGCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
  }, []);

  const playHeartbeat = useCallback((isAttack: boolean) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (isAttack) {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  }, []);

  const fetchHeartbeat = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/v1/health`, {
        method: 'GET',
        headers: { 'X-API-Key': 'demo-key' },
      });
      const isAttack = !res.ok;
      const peak = isAttack ? AMPLITUDE * 2.5 : AMPLITUDE;
      dataRef.current.push(peak);
      if (dataRef.current.length > 200) dataRef.current.shift();
      playHeartbeat(isAttack);
      onHeartbeat?.(isAttack);
    } catch {
      dataRef.current.push(0);
      if (dataRef.current.length > 200) dataRef.current.shift();
    }
  }, [apiUrl, playHeartbeat, onHeartbeat]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const centerY = h / 2;

      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, w, h);

      // Grid sutil
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Linha ECG
      const data = dataRef.current;
      const stepX = w / 200;

      for (let i = 1; i < data.length; i++) {
        const x1 = (i - 1) * stepX;
        const y1 = centerY - data[i - 1];
        const x2 = i * stepX;
        const y2 = centerY - data[i];
        const isAttack = data[i] > AMPLITUDE * 1.5;

        ctx.beginPath();
        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = isAttack ? COLOR_ATTACK : COLOR_NORMAL;
        ctx.shadowBlur = isAttack ? 20 : 10;
        ctx.shadowColor = isAttack ? COLOR_ATTACK : COLOR_NORMAL;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Decair amplitude
      for (let i = 0; i < data.length; i++) {
        data[i] *= 0.95;
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    const interval = setInterval(fetchHeartbeat, 2000);
    const handleClick = () => initAudio();
    canvas.addEventListener('click', handleClick, { once: true });

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [fetchHeartbeat, initAudio]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[200px] cursor-pointer"
      style={{ background: 'transparent' }}
      role="img"
      aria-label="ECG em tempo real mostrando batimentos da API"
    />
  );
}
