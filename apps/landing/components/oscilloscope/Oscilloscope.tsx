'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

interface Channel {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  color: string;
  frequency: number;
}

const CHANNELS: Channel[] = [
  { method: 'GET', color: '#00FF88', frequency: 440 },
  { method: 'POST', color: '#0088FF', frequency: 523 },
  { method: 'PUT', color: '#FFBB00', frequency: 659 },
  { method: 'DELETE', color: '#FF003C', frequency: 880 },
];

interface OscilloscopeProps {
  isScanning: boolean;
  threatDetected: boolean;
  onAudioInit?: () => void;
}

export default function Oscilloscope({ isScanning, threatDetected, onAudioInit }: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    CHANNELS.forEach((ch) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(ch.frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      osc.start();
      oscillatorsRef.current.push(osc);
      gainNodesRef.current.push(gain);
    });

    setAudioInitialized(true);
    onAudioInit?.();
  }, [onAudioInit]);

  useEffect(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (isScanning) {
      gainNodesRef.current.forEach((gain, i) => {
        const targetGain = threatDetected ? 0.08 : 0.05;
        gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.1);
        if (threatDetected) {
          oscillatorsRef.current[i].type = 'sawtooth';
          oscillatorsRef.current[i].detune.setValueAtTime(
            (Math.random() - 0.5) * 100,
            ctx.currentTime
          );
        } else {
          oscillatorsRef.current[i].type = 'sine';
          oscillatorsRef.current[i].detune.setValueAtTime(0, ctx.currentTime);
        }
      });
    } else {
      gainNodesRef.current.forEach((gain) => {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      });
    }
  }, [isScanning, threatDetected]);

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

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const channelHeight = h / 4;

      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const y = i * channelHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      phaseRef.current += 0.05;

      CHANNELS.forEach((ch, i) => {
        const centerY = i * channelHeight + channelHeight / 2;
        const amplitude = isScanning ? (threatDetected ? 25 : 15) : 5;
        const freq = 0.02 + i * 0.005;

        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = isScanning ? 15 : 5;
        ctx.shadowColor = ch.color;

        for (let x = 0; x < w; x += 2) {
          const y = centerY + Math.sin(x * freq + phaseRef.current + i) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = ch.color;
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(ch.method, 10, centerY - 20);
      });

      // Sweep bar
      if (isScanning) {
        const sweepX = (phaseRef.current * 50) % (w + 100) - 50;
        const gradient = ctx.createLinearGradient(sweepX - 30, 0, sweepX + 30, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, 'rgba(157, 0, 255, 0.3)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(sweepX - 30, 0, 60, h);

        ctx.strokeStyle = '#9D00FF';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#9D00FF';
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, h);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isScanning, threatDetected]);

  return (
    <div className="relative w-full">
      <canvas
        ref={canvasRef}
        className="w-full h-[300px] cursor-pointer rounded border border-secondary/20"
        onClick={initAudio}
        role="img"
        aria-label="Osciloscópio sonoro com 4 canais de requisições HTTP"
      />
      {!audioInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/80 rounded">
          <p className="font-mono text-sm text-secondary">{'[ CLIQUE PARA ATIVAR ÁUDIO ]'}</p>
        </div>
      )}
    </div>
  );
}
