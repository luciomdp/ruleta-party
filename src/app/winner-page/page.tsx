'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGameStore } from '@/store/useGameStore';
import { gradientBg, glassBtn } from '@/ui/theme';

type Particle = {
  id: number;
  emoji: string;
  left: number;     // 0-100 vw
  size: number;     // px
  duration: number; // s
  delay: number;    // s
  drift: number;    // px
};

type EmojiStyle = React.CSSProperties & Record<'--drift', string>;

const EMOJIS = ['🎉','🎊','🏆','✨','🥳','💥','🎈','🎇'];

export default function WinnerPage() {
  const router = useRouter();
  const alive  = useGameStore(s => s.alive);
  const reset  = useGameStore(s => s.reset);
  const restart = useGameStore(s => s.restart);

  const winner = alive.length ? alive[0] : 'Ganador';

  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      const batch: Particle[] = Array.from({ length: 12 }).map(() => ({
        id: idRef.current++,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        left: Math.random() * 100,
        size: 24 + Math.floor(Math.random() * 18),
        duration: 3 + Math.random() * 2.5,
        delay: Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 80,
      }));
      setParticles(prev => [...prev, ...batch].slice(-220));
    };

    const t = setInterval(spawn, 650);
    spawn();
    return () => clearInterval(t);
  }, []);

  const handleRestart = () => {
    restart();
    router.push('/roulette');
  };

  const handleHome = () => {
    reset();
    router.push('/');
  };

  return (
    <main className={`h-[100dvh] overflow-hidden ${gradientBg} text-white relative`}>
      {/* capa de emojis */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map(p => {
          const style: EmojiStyle = {
            left: `${p.left}vw`,
            bottom: '-10vh',
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `translateX(0)`,
            ['--drift']: `${p.drift}px`,
          };
          return (
            <span
              key={p.id}
              aria-hidden
              className="absolute will-change-transform opacity-0 animate-emoji-rise"
              style={style}
            >
              {p.emoji}
            </span>
          );
        })}
      </div>

      <div className="h-full mx-auto max-w-md flex flex-col items-center p-6 gap-8 relative z-10">
        <header className="w-full flex items-center justify-between">
          <div className="text-white/80">Final Clash</div>
          <div className="text-white/60">Fin de partida</div>
        </header>

        <section className="flex flex-col items-center justify-center gap-6 mt-16">
          <Image
            src="/icons/final-clash.png"
            alt="Final Clash"
            width={96}
            height={96}
            className="opacity-90"
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold">Ganador</h2>
            <p className="text-xl mt-2">{winner}</p>
          </div>

        <div className="flex gap-3 mt-2">
            <button className={`px-4 py-3 ${glassBtn}`} onClick={handleRestart}>
              Reiniciar partida
            </button>
            <button className={`px-4 py-3 ${glassBtn}`} onClick={handleHome}>
              Volver al inicio
            </button>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes emoji-rise {
          0%   { transform: translateY(0) translateX(0) scale(0.9); opacity: 0; }
          10%  { opacity: 1; }
          50%  { transform: translateY(-50vh) translateX(var(--drift, 0)); }
          100% { transform: translateY(-105vh) translateX(var(--drift, 0)) scale(1.1); opacity: 0; }
        }
        .animate-emoji-rise {
          animation-name: emoji-rise;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}
