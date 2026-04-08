'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

const COLORS = [
  '#22c55e', '#f59e0b', '#3b82f6', '#ec4899',
  '#a855f7', '#f97316', '#06b6d4', '#eab308',
];

function makeParticle(canvasWidth: number): Particle {
  return {
    x: Math.random() * canvasWidth,
    y: -10 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: 8 + Math.random() * 8,
    height: 5 + Math.random() * 5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    opacity: 1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.05 + Math.random() * 0.05,
  };
}

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    particles: Particle[];
    raf: number;
    spawning: boolean;
    spawnCount: number;
  }>({ particles: [], raf: 0, spawning: false, spawnCount: 0 });

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const s = stateRef.current;
    s.particles  = [];
    s.spawning   = true;
    s.spawnCount = 0;

    const TOTAL_PARTICLES = 180;
    const SPAWN_BURST     = 60; // first frame burst
    const SPAWN_PER_FRAME = 6;

    // Initial burst
    for (let i = 0; i < SPAWN_BURST; i++) {
      s.particles.push(makeParticle(canvas.width));
      s.spawnCount++;
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn more over time
      if (s.spawning && s.spawnCount < TOTAL_PARTICLES) {
        const toSpawn = Math.min(SPAWN_PER_FRAME, TOTAL_PARTICLES - s.spawnCount);
        for (let i = 0; i < toSpawn; i++) {
          s.particles.push(makeParticle(canvas.width));
          s.spawnCount++;
        }
        if (s.spawnCount >= TOTAL_PARTICLES) s.spawning = false;
      }

      s.particles = s.particles.filter((p) => {
        p.wobble += p.wobbleSpeed;
        p.x       += p.vx + Math.sin(p.wobble) * 0.8;
        p.y       += p.vy;
        p.vy      += 0.06; // gravity
        p.rotation += p.rotationSpeed;

        // Fade out in the bottom 20% of the screen
        const fadeStart = canvas.height * 0.8;
        if (p.y > fadeStart) {
          p.opacity = Math.max(0, 1 - (p.y - fadeStart) / (canvas.height * 0.2));
        }

        if (p.y > canvas.height || p.opacity <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        // Alternate between rect and ellipse for variety
        if (p.width > 13) {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.width / 2, p.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }
        ctx.restore();
        return true;
      });

      if (s.particles.length > 0 || s.spawning) {
        s.raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    s.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      style={{ display: active ? 'block' : 'none' }}
    />
  );
}