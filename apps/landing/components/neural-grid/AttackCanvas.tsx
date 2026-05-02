'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface AttackCanvasProps {
  progressRef: React.RefObject<number>;
}

export function AttackCanvas({ progressRef }: AttackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = 1;
    let nodes: Node[] = [];
    let explosionParticles: Particle[] = [];
    let animId: number;
    let hasExploded = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      canvas!.width = cw * dpr;
      canvas!.height = ch * dpr;
      canvas!.style.width = `${cw}px`;
      canvas!.style.height = `${ch}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    const initNodes = () => {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 200 : 600;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      nodes = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * cw;
        const y = Math.random() * ch;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1 + 0.6,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    const getProgress = () => progressRef.current ?? 0;

    const draw = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const p = getProgress();
      ctx!.clearRect(0, 0, cw, ch);

      // Attack line state
      const lineActive = p >= 0.2 && p < 0.8;
      const lineProgress = lineActive ? (p - 0.2) / 0.6 : 0;
      const lineX = lineActive ? lineProgress * (cw + 200) - 100 : -999;
      const lineY = lineActive ? lineProgress * (ch + 200) - 100 : -999;
      const lineEndX = lineActive ? lineX + 150 : -999;
      const lineEndY = lineActive ? lineY + 150 : -999;

      // Explosion trigger
      if (p >= 0.72 && !hasExploded) {
        hasExploded = true;
        const ex = lineEndX;
        const ey = lineEndY;
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          explosionParticles.push({
            x: ex,
            y: ey,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: 1,
            maxLife: 0.8 + Math.random() * 0.4,
            size: 1 + Math.random() * 2,
          });
        }
      }
      if (p < 0.7) {
        hasExploded = false;
        explosionParticles = [];
      }

      // Update explosion particles
      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const ep = explosionParticles[i];
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.vy += 0.05; // gravity
        ep.life -= 0.015;
        if (ep.life <= 0) {
          explosionParticles.splice(i, 1);
        }
      }

      // Draw connections and nodes
      const connectDist = 100;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Distance to attack line
        let distToLine = Infinity;
        if (lineActive) {
          // Project point to line segment
          const lx = lineEndX - lineX;
          const ly = lineEndY - lineY;
          const len = Math.sqrt(lx * lx + ly * ly);
          if (len > 0) {
            const t = Math.max(0, Math.min(1, ((node.x - lineX) * lx + (node.y - lineY) * ly) / (len * len)));
            const projX = lineX + t * lx;
            const projY = lineY + t * ly;
            distToLine = Math.sqrt((node.x - projX) ** 2 + (node.y - projY) ** 2);
          }
        }

        // Determine node color
        let nodeColor = 'rgba(0, 240, 255, 0.8)';
        let nodeSize = node.size;

        if (distToLine < 80 && lineActive) {
          if (p < 0.5) {
            nodeColor = 'rgba(255, 0, 0, 0.9)'; // Red near line
          } else if (p < 0.75) {
            nodeColor = 'rgba(255, 107, 0, 0.9)'; // Amber detection
          }
          nodeSize *= 1.3;
        }

        // Detection circle
        if (p >= 0.48 && p < 0.6 && distToLine < 120) {
          const detectAlpha = Math.max(0, 1 - (p - 0.48) / 0.12);
          const detectScale = (p - 0.48) / 0.12 * 3;
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.size * detectScale, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 107, 0, ${detectAlpha * 0.3})`;
          ctx!.fill();
        }

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.25;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx!.lineWidth = 0.4;
            ctx!.moveTo(node.x, node.y);
            ctx!.lineTo(other.x, other.y);
            ctx!.stroke();
          }
        }

        // Pulse
        node.pulsePhase += node.pulseSpeed;
        const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.2;

        // Draw node
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, nodeSize * pulseScale, 0, Math.PI * 2);
        ctx!.fillStyle = nodeColor;
        ctx!.fill();
      }

      // Draw attack line
      if (lineActive) {
        ctx!.beginPath();
        ctx!.moveTo(lineX, lineY);
        ctx!.lineTo(lineEndX, lineEndY);
        ctx!.strokeStyle = '#FF0000';
        ctx!.lineWidth = 3;
        ctx!.shadowColor = '#FF0000';
        ctx!.shadowBlur = 10;
        ctx!.stroke();
        ctx!.shadowBlur = 0;

        // Trail
        ctx!.beginPath();
        ctx!.moveTo(lineX - 20, lineY - 20);
        ctx!.lineTo(lineEndX - 20, lineEndY - 20);
        ctx!.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx!.lineWidth = 2;
        ctx!.stroke();
      }

      // Draw explosion particles
      for (const ep of explosionParticles) {
        ctx!.beginPath();
        ctx!.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 240, 255, ${ep.life})`;
        ctx!.fill();
      }

      // Final state: grid settles back to peaceful cyan
      if (p >= 0.9) {
        const settleAlpha = (p - 0.9) / 0.1;
        ctx!.fillStyle = `rgba(0, 240, 255, ${settleAlpha * 0.05})`;
        ctx!.fillRect(0, 0, cw, ch);
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
