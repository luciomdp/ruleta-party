// app/elimination/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useGameStore } from '@/store/useGameStore';
import ConfirmModal from '@/components/ConfirmModal';

export default function EliminationPage() {
  const router = useRouter();
  const { alive, eliminate, nextRound } = useGameStore();
  const [candidate, setCandidate] = useState<string | null>(null);

  useEffect(() => {
    if (!alive.length) router.push('/roulette');
  }, [alive.length, router]);

  const confirmEliminate = () => {
    if (!candidate) return;
    eliminate(candidate);
    nextRound();
    toast.error(`${candidate} ha sido eliminado de la partida`, { icon: '💀' });
    setCandidate(null);
    router.push('/roulette');
  };

  return (
    <main className="min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-4">Eliminación</h1>
        <p className="mb-6 text-white/80">Elegí a quién eliminar.</p>

        <div className="max-h-[calc(100dvh-200px)] overflow-y-auto pr-1">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alive.map((name) => (
              <li key={name}>
                <button
                  onClick={() => setCandidate(name)}
                  className="w-full rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 px-4 py-3 text-left font-semibold backdrop-blur border border-white/20"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {alive.length === 0 && (
          <p className="text-sm mt-6 text-white/70">No hay jugadores vivos.</p>
        )}
      </div>

      {candidate && (
        <ConfirmModal
          title="Confirmar eliminación"
          subtitle={`¿Seguro que querés eliminar a ${candidate}?`}
          onCancel={() => setCandidate(null)}
          onSuccess={confirmEliminate}
        />
      )}
    </main>
  );
}
