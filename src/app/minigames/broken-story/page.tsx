// src/app/minigames/broken-story/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore, Phase } from '@/store/useGameStore';
import TurnModal from '@/components/TurnModal';

//TODO poner en 20
const TURN_SECONDS = 2;

export default function BrokenStoryPage() {
  const router = useRouter();

  // store
  const story      = useGameStore(s => s.currentStory);
  //TODO: Fix [storie]: <Resolver el problema de que no se actualiza la historia entre rondas>
  const ensureSeed = useGameStore(s => s.ensureStory);
  
  const players     = useGameStore(s => s.alive);
  const turnIndex   = useGameStore(s => s.bsTurnIndex);
  const nextTurn    = useGameStore(s => s.bsNext);
  const resetTurns  = useGameStore(s => s.bsReset);
  const setPhase    = useGameStore(s => s.setPhase);

  // local
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);

  useEffect(() => { 
    if (!story) ensureSeed();
  }, [story, ensureSeed]);

  // si cambia la lista de jugadores, resetear turnos
  useEffect(() => { 
    resetTurns(); 
    setPlaying(false); 
    setTimeLeft(TURN_SECONDS); 
  }, [players, resetTurns]);

  const startTurn = () => {
    if (!players.length || turnIndex >= players.length) return;
    setTimeLeft(TURN_SECONDS);
    setPlaying(true);
  };

  // timer
  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      setPlaying(false);
      nextTurn();
      setTimeLeft(TURN_SECONDS);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [playing, timeLeft, nextTurn]);

  const allPlayed = players.length > 0 && turnIndex >= players.length;
  const currentName = players.length && turnIndex < players.length ? players[turnIndex] : '';

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
                Cada jugador dispone de
                <span className="font-semibold"> 20&nbsp;segundos</span> para construir una historia con la frase en pantalla.
              </p>
              <p>
                Al final, deberán eliminar a quien haya hecho la aportación menos creativa o coherente.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 border border-white/20 p-3 shadow">
              <div className="relative">
                <span className="absolute -left-2 -top-3 text-5xl text-white/20 select-none">“</span>
                <blockquote className="text-lg pl-4">{story ?? '…'}</blockquote>
              </div>
            </div>

            <div className="rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-sm text-white/85">
              💡 Consejo: eviten interrumpir al jugador de turno.
            </div>
          </div>
        </section>

        <footer className="pt-1 mt-2 space-y-2">
          {!allPlayed && players.length > 0 && (
            <button
              type="button"
              onClick={startTurn}
              className="w-full rounded-xl py-3 font-semibold border border-white/15 shadow bg-white/15 hover:bg-white/20 active:bg-white/25 transition"
            >
              Turno de <span className="font-bold">{currentName}</span>
            </button>
          )}

          <button
            onClick={() => { setPhase(Phase.Elimination); router.push('/elimination'); }}
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

      <TurnModal
        open={playing}
        playerName={currentName}
        story={story}
        timeLeft={timeLeft}
      />
    </main>
  );
}
