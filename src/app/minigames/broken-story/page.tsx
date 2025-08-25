// src/app/minigames/broken-story/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';

const TURN_SECONDS = 20;

export default function BrokenStoryPage() {
  const router = useRouter();
  const current = useGameStore(s => s.currentStory);
  const draw = useGameStore(s => s.drawStorySeed);
  const alive = useGameStore(s => s.alive);

  useEffect(() => {
    if (!current) draw();
  }, [current, draw]);


  const order = useMemo(() => alive, [alive]);
  const [idx, setIdx] = useState(0);          // jugador actual
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);

  const startTurn = () => {
    if (!order.length || idx >= order.length) return;
    setTimeLeft(TURN_SECONDS);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setTimeLeft(tl => {
        if (tl <= 1) {
          clearInterval(t);
          setPlaying(false);
          setIdx(i => i + 1);
          return TURN_SECONDS;
        }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing]);

  const allPlayed = order.length > 0 && idx >= order.length;

  return (
    <main className="h-[100dvh] bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white">
      <div className="mx-auto max-w-md h-full flex flex-col p-6 gap-6">
        <header className="pt-2">
          <h1 className="text-4xl text-center font-extrabold drop-shadow">Historia rota</h1>
        </header>

        <section className="flex-1 overflow-y-auto">
          <div className="rounded-2xl p-5 leading-relaxed backdrop-blur space-y-5">
            <div className="space-y-2">
              <p>
                Construyan una historia por turnos. Cada jugador dispone de
                <span className="font-semibold"> 20&nbsp;segundos</span> para construir una historia con la frase en pantalla.
              </p>
              <p>
                Al final, deberán votar la aportación menos creativa o coherente; esa persona queda eliminada.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 border border-white/20 p-3 shadow">
              <div className="relative">
                <span className="absolute -left-2 -top-3 text-5xl text-white/20 select-none">“</span>
                <blockquote className="text-lg pl-4">{current ?? '…'}</blockquote>
              </div>
            </div>

            <div className="rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-sm text-white/85">
              💡 Consejo: eviten interrumpir al jugador de turno.
            </div>
          </div>
        </section>

        {/* Botones */}
        <footer className="pt-1 mt-2 space-y-2">
          {!allPlayed && order.length > 0 && (
            <button
              type="button"
              onClick={startTurn}
              className="w-full rounded-xl py-3 font-semibold border border-white/15 shadow bg-white/15 hover:bg-white/20 active:bg-white/25 transition"
            >
              Turno de <span className="font-bold">{order[idx]}</span>
            </button>
          )}

          <button
            onClick={() => router.push('/elimination')}
            disabled={!allPlayed}
            className={`w-full rounded-xl py-3 font-semibold border shadow transition
              ${!allPlayed
                ? 'bg-white/15 text-white/60 border-white/20 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/25 active:bg-white/30 border-white/15'}`}
          >
            Eliminar jugador
          </button>
        </footer>
      </div>

      {/* Modal */}
      {playing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 p-6 text-white shadow-2xl backdrop-blur bg-white/10">
            <div className="mb-3 text-sm opacity-85">
              Turno de <span className="font-semibold">{order[idx]}</span>
            </div>

            <div className="rounded-xl bg-white/10 border border-white/20 p-4 mb-4">
              <div className="relative">
                <span className="absolute -left-2 -top-4 text-5xl text-white/20 select-none">“</span>
                <blockquote className="text-lg pl-4">{current ?? '…'}</blockquote>
              </div>
            </div>

            <div className="text-center text-5xl font-bold tabular-nums">{timeLeft}s</div>

            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="mt-6 w-full rounded-xl bg-white/15 hover:bg-white/20 active:bg-white/25 border border-white/25 px-4 py-3 transition"
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </main>
  );
}