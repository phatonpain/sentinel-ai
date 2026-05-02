'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DemoGridProps {
  step: number;
  error: boolean;
  nodeCount?: number;
}

export function DemoGrid({ step, error, nodeCount = 50 }: DemoGridProps) {
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodeCount; i++) {
      arr.push({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        delay: i * 0.03,
        size: 1.5 + Math.random() * 2,
      });
    }
    return arr;
  }, [nodeCount]);

  // Sequential activation based on step
  const getNodeOpacity = (i: number) => {
    if (error) return 1;
    if (step < 2) return 0.15;
    const threshold = (step - 2) * 25; // step 2: 0, step 3: 25, step 4: 50, step 5: 75
    if (i < threshold) return 1;
    if (i < threshold + 10) return 0.6;
    return 0.15;
  };

  const getNodeColor = (i: number) => {
    if (error) return '#FF0000';
    if (step >= 2.5 && step < 3 && i % 7 === 0) return '#FF6B00'; // brief amber detection
    return '#00F0FF';
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* Connections */}
      {step >= 2 && nodes.map((node, i) =>
        nodes.slice(i + 1).map((other, j) => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 20) return null;
          const active = getNodeOpacity(i) > 0.5 && getNodeOpacity(j + i + 1) > 0.5;
          return (
            <line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={other.x}
              y2={other.y}
              stroke="rgba(0, 240, 255, 0.15)"
              strokeWidth="0.3"
              opacity={active ? 1 : 0.2}
            />
          );
        })
      )}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={node.size}
          fill={getNodeColor(i)}
          initial={{ opacity: 0.15 }}
          animate={{
            opacity: getNodeOpacity(i),
            fill: getNodeColor(i),
          }}
          transition={{ duration: 0.4, delay: node.delay }}
        />
      ))}
    </svg>
  );
}
