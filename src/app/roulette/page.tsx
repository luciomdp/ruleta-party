'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { gradientBg, glassBtn } from '@/ui/theme';
import { SLICES } from '@/lib/slices';
import { SliceKey } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';
import Roulette from '@/components/Roulette';

export default function RoulettePage() {
  const router = useRouter();

  const alive        = useGameStore(s => s.alive);
  const round        = useGameStore(s => s.round);
  const dead         = useGameStore(s => s.dead);
  const reviveRandom = useGameStore(s => s.reviveRandom);
  const reset        = useGameStore(s => s.reset);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (alive.length > 3) return;
    // Cuando quedan 3 jugadores, comienza el clash battle
    router.push('/final-clash');
  }, [alive, router]);

  const handleResult = (key: SliceKey) => {
    if (key === SliceKey.Revive) {
      if (dead.length) reviveRandom();
      return;
    }
    // Navegar a la ruta del minijuego
    router.push(`${SLICES.find(s => s.key === key)?.path}`); 
  };

  const resetGame = () => {
    reset();
    setShowConfirm(false);
    router.push('/');
  };

  return (
    <main className={`h-[100dvh] overflow-hidden ${gradientBg} text-white`}>
      <div className="h-full mx-auto max-w-md flex flex-col items-center p-6 gap-6">
        {/* header */}
        <header className="w-full flex items-center justify-between">
          <div className="text-white/80">
            Ronda <span className="font-bold">{round}</span>
          </div>
          <button
            className={`px-3 py-2 ${glassBtn} shadow-sm`}
            onClick={() => setShowConfirm(true)}
          >
            Reiniciar
          </button>
        </header>

        <Roulette
          slices={SLICES}
          onResult={handleResult}
          label="Ruleta"
          spinButtonText="Girar"
          className="flex flex-col items-center gap-4"
        />

        {/* confirm modal */}
        {showConfirm && (
          <ConfirmModal
            title="Reiniciar la partida"
            subtitle="Vas a reiniciar la partida. ¿Seguro? Se perderá el progreso."
            onCancel={() => setShowConfirm(false)}
            onSuccess={resetGame}
          />
        )}
      </div>
    </main>
  );
}
