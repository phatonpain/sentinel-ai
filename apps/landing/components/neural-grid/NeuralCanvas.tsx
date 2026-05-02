'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  pulsePhase: number;
  pulseSpeed: number;
  pulseBase: number;
}

export function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = 1;
    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999 };
    let isMobile = false;
    let animId: number;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      ctx!.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      isMobile = window.innerWidth < 768;
      const count = isMobile ? 300 : 800;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      particles = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * cw;
        const y = Math.random() * ch;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.2 + 0.8,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.04,
          pulseBase: 1 + Math.random() * 0.3,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      ctx!.clearRect(0, 0, cw, ch);

      // Connections
      const connectDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.3;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // Mouse connections & repulsion
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200 && dist > 0) {
            // Connection line to mouse
            const alpha = (1 - dist / 200) * 0.4;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();

            // Repulsion
            const force = (200 - dist) / 200;
            p.vx += (dx / dist) * force * 0.8;
            p.vy += (dy / dist) * force * 0.8;
          }
        }
      }

      // Update & draw particles
      const time = Date.now() * 0.001;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Return to base position (elastic)
        p.vx += (p.baseX - p.x) * 0.003;
        p.vy += (p.baseY - p.y) * 0.003;

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Base drift
        p.x += p.vx;
        p.y += p.vy;

        // Mobile: slow auto rotation
        if (isMobile) {
          p.baseX += Math.sin(time * 0.1 + i) * 0.02;
          p.baseY += Math.cos(time * 0.1 + i) * 0.02;
        }

        // Boundary wrap
        if (p.x < 0) p.x = cw;
        if (p.x > cw) p.x = 0;
        if (p.y < 0) p.y = ch;
        if (p.y > ch) p.y = 0;
        if (p.baseX < 0) p.baseX = cw;
        if (p.baseX > cw) p.baseX = 0;
        if (p.baseY < 0) p.baseY = ch;
        if (p.baseY > ch) p.baseY = 0;

        // Pulse
        p.pulsePhase += p.pulseSpeed;
        const pulseScale = p.pulseBase + Math.sin(p.pulsePhase) * 0.3;
        const drawSize = p.size * pulseScale;

        // Draw node
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 240, 255, 0.8)`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    if (!isMobile) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);
    }

    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
