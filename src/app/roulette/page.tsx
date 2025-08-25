'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { gradientBg, glassBtn } from '@/ui/theme';
import { SLICES } from '@/lib/slices';
import type { SliceKey } from '@/lib/types';
import ConfirmModal from '@/components/ConfirmModal';
import dynamic from 'next/dynamic';

const Roulette = dynamic(() => import('@/components/Roulette'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-3xl font-extrabold drop-shadow">Ruleta</h2>
      <div className="w-72 h-72 rounded-full bg-white/10 animate-pulse border border-white/20" />
      <button
        disabled
        className="mt-5 px-6 py-3 rounded-xl font-semibold border border-white/30 bg-white/30 text-white/60 cursor-not-allowed"
      >
        Cargando…
      </button>
    </div>
  ),
});

export default function RoulettePage() {
  const router = useRouter();

  const round        = useGameStore(s => s.round);
  const dead         = useGameStore(s => s.dead);
  const reviveRandom = useGameStore(s => s.reviveRandom);
  const reset        = useGameStore(s => s.reset);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleResult = (key: SliceKey) => {
    if (key === 'revivir') {
      if (dead.length) reviveRandom();
      return;
    }
    router.push(`/minigames/${key}`);
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
