'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { gradientBg, glassBtn } from '@/ui/theme';

const LETTERS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

export default function FinalClashPage() {
  const router      = useRouter();
  const alive       = useGameStore(s => s.alive);
  const eliminate   = useGameStore(s => s.eliminate);
  const reset       = useGameStore(s => s.reset);

  // Intro
  const [showIntro, setShowIntro] = useState(true);

  // Turno
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentPlayer = alive[currentIdx] ?? '';

  // Timer
  const START_SECONDS = 10;
  const [timeLeft, setTimeLeft] = useState(START_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Letra fija al inicio
  const [letter] = useState<string>(
    () => LETTERS[Math.floor(Math.random() * LETTERS.length)]
  );

  // Fin de intro
  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(t);
  }, []);

  // Guardas
  const winner = alive.length === 1 ? alive[0] : null;
  useEffect(() => {
    if (alive.length === 0) router.push('/');
  }, [alive.length, router]);

  // Timer
  useEffect(() => {
    if (!running) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          intervalRef.current = null;
          handleExpire();
          return START_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, currentIdx, alive.length]);

  useEffect(() => {
    if (currentIdx >= alive.length && alive.length > 0) setCurrentIdx(0);
  }, [alive.length, currentIdx]);

  const startOrNext = () => {
    if (!running) {
      setTimeLeft(START_SECONDS);
      setRunning(true);
    } else {
      advanceTurn(false);
    }
  };

  const handleExpire = () => {
    const playerOut = currentPlayer;
    if (playerOut) eliminate(playerOut);
    advanceTurn(true);
  };

  const advanceTurn = (fromTimeout: boolean) => {
    setRunning(false);
    setTimeLeft(START_SECONDS);
    setCurrentIdx(prev => {
      if (alive.length === 0) return 0;
      if (fromTimeout) return Math.min(prev, Math.max(alive.length - 1, 0));
      return (prev + 1) % alive.length;
    });
  };

  const buttonLabel = useMemo(() => {
    if (winner) return 'Reiniciar';
    if (!running) return `Turno de ${currentPlayer || '—'}`;
    return 'Siguiente';
  }, [running, currentPlayer, winner]);

  const onButtonClick = () => {
    if (winner) {
      reset();
      router.push('/');
      return;
    }
    startOrNext();
  };

  return (
    <main className={`h-[100dvh] overflow-hidden ${gradientBg} text-white`}>
      {showIntro && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
            <Image
              src="/icons/final-clash.png"
              alt="Final Clash"
              width={120}
              height={120}
              className="drop-shadow-md"
              priority
            />
            <h1 className="text-3xl font-extrabold tracking-wide">Riña final</h1>
            <div className="flex gap-3 text-white/90">
              {alive.slice(0,3).map((n) => (
                <span key={n} className="px-3 py-1 rounded-full bg-white/10">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="h-full mx-auto max-w-md flex flex-col items-center p-6 gap-8 relative">
        <header className="w-full flex items-center justify-between">
          <div className="text-white/80">Final Clash</div>
          <div className="text-3xl font-bold tabular-nums">
            {winner ? '—' : timeLeft}
          </div>
        </header>

        {winner ? (
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
            <button className={`px-4 py-3 ${glassBtn}`} onClick={onButtonClick}>
              Reiniciar
            </button>
          </section>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="size-40 rounded-full border border-white/30 flex items-center justify-center shadow-inner">
                <span className="text-6xl font-extrabold leading-none select-none">
                  {letter}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-4">
              <div className="text-white/80">
                Jugador actual: <span className="font-bold">{currentPlayer || '—'}</span>
              </div>
              <button className={`px-5 py-3 ${glassBtn}`} onClick={onButtonClick}>
                {buttonLabel}
              </button>
              <p className="text-xs text-white/60">
                Si se agota el tiempo, se elimina automáticamente.
              </p>
            </div>

            <div className="w-full mt-auto pb-4">
              <h3 className="text-white/70 text-sm mb-2">En juego</h3>
              <ul className="flex gap-2 flex-wrap">
                {alive.map((n, i) => (
                  <li
                    key={n}
                    className={`px-3 py-1 rounded-full text-sm ${
                      i === currentIdx ? 'bg-white/30' : 'bg-white/10'
                    }`}
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .animate-in { animation: animIn 0.5s ease both; }
        @keyframes animIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
