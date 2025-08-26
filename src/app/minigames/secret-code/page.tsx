// src/app/minigames/secret-code/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useGameStore, Phase } from '@/store/useGameStore';
import { WORD_SETS } from '@/lib/wordpairs';

export default function SecretCodePage() {
  const router     = useRouter();
  const alive      = useGameStore(s => s.alive);
  const setPhase   = useGameStore(s => s.setPhase);

  useEffect(() => {
    if (!alive.length) router.push('/roulette');
  }, [alive.length, router]);

  const { pair, impostorIndex } = useMemo(() => {
    const p = WORD_SETS[Math.floor(Math.random() * WORD_SETS.length)];
    const idx = Math.floor(Math.random() * Math.max(alive.length, 1));
    return { pair: p, impostorIndex: idx };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alive.join('|')]);

  const assignments = useMemo(() => {
    const map = new Map<string, string>();
    alive.forEach((name, i) => {
      map.set(name, i === impostorIndex ? pair.impostor : pair.common);
    });
    return map;
  }, [alive, impostorIndex, pair]);

  // tracking de vistos
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const init: Record<string, boolean> = {};
    alive.forEach(n => { init[n] = false; });
    setSeen(init);
    setCurrentIndex(0);
  }, [alive]);

  const allSeen = alive.length > 0 && alive.every(n => seen[n]);

  // índice del próximo jugador no visto
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentName = alive[currentIndex] ?? null;

  // modal
  const [openFor, setOpenFor] = useState<string | null>(null);
  const currentWord = openFor ? assignments.get(openFor) ?? '' : '';

  const openForCurrent = () => {
    if (currentName && !seen[currentName]) setOpenFor(currentName);
  };

  const advanceToNextUnseen = (from: number) => {
    const len = alive.length;
    for (let i = from + 1; i < len; i++) {
      if (!seen[alive[i]]) return i;
    }
    // no hay más por delante; probar desde el inicio por si hubo cambios
    for (let i = 0; i < len; i++) {
      if (!seen[alive[i]]) return i;
    }
    return from; // todos vistos
  };

  const handleClose = () => {
    if (openFor) {
      setSeen(s => ({ ...s, [openFor]: true }));
      const idx = alive.indexOf(openFor);
      setCurrentIndex(prev => advanceToNextUnseen(idx >= 0 ? idx : prev));
    }
    setOpenFor(null);
  };

  // anunciar starter cuando todos vieron
  const announcedRef = useRef(false);
  useEffect(() => {
    if (!allSeen || announcedRef.current || alive.length === 0) return;
    announcedRef.current = true;
    const starter = alive[Math.floor(Math.random() * alive.length)];

    toast.success(`${starter} comienza la ronda`, { icon: '🎙️' });
  }, [allSeen, alive]);

  const goElimination = () => {
    setPhase(Phase.Elimination);
    router.push('/elimination');
  };

  return (
    <main className="min-h-dvh bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white">
      <div className="mx-auto max-w-md min-h-dvh flex flex-col p-6 gap-6">
        <header className="pt-2 text-center">
          <h1 className="text-4xl font-extrabold drop-shadow">Código secreto</h1>
        </header>

        <section className="flex-1 overflow-y-auto">
          <div className="rounded-2xl p-5 leading-relaxed backdrop-blur space-y-5 border border-white/15 bg-white/10">
            <p>
              Cada jugador recibirá <span className="font-semibold">una palabra</span>. <br></br>Uno de ustedes, tendrá el rol del impostor, y recibirá otra <span className="font-semibold">distinta</span>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-white/90">
              <li>Tras ver sus palabras, cada uno deberá decir una palabra asociada a la suya</li>
              <li>Luego, todos debatirán quién podría ser el impostor.</li>
              <li>Al final, una persona deberá ser eliminada 💀</li>
            </ul>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={openForCurrent}
              disabled={allSeen || !currentName || seen[currentName]}
              className={`w-full rounded-xl py-3 font-semibold border shadow transition
                ${allSeen || !currentName || seen[currentName]
                  ? 'bg-white/10 text-white/60 border-white/20 cursor-not-allowed'
                  : 'bg-white/20 hover:bg-white/25 active:bg-white/30 border-white/15'}`}
            >
              {allSeen ? 'Todos vieron su palabra' : `Turno de ${currentName}`}
              {!allSeen && seen[currentName] && <span className="ml-2 text-xs align-middle">visto</span>}
            </button>

            {/* indicador simple de progreso */}
            <p className="mt-3 text-center text-sm text-white/80">
              {Object.values(seen).filter(Boolean).length}/{alive.length} vistos
            </p>
          </div>
        </section>

        <footer className="pt-1 mt-2 space-y-2">
          <button
            onClick={goElimination}
            disabled={!allSeen}
            className={`w-full rounded-xl py-3 font-semibold border shadow transition
              ${!allSeen
                ? 'bg-white/15 text-white/60 border-white/20 cursor-not-allowed'
                : 'bg-white/20 hover:bg-white/25 active:bg-white/30 border-white/15'}`}
          >
            Eliminar jugador
          </button>
        </footer>
      </div>

      {openFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm rounded-2xl bg-white/95 text-gray-900 p-6 text-center shadow-xl">
            <p className="text-sm text-gray-600 mb-2">Mostrale sólo a <span className="font-semibold">{openFor}</span></p>
            <div className="text-4xl font-extrabold tracking-wide my-4 select-none">
              {currentWord}
            </div>
            <button
              onClick={handleClose}
              className="mt-2 w-full rounded-xl py-3 font-semibold border border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
