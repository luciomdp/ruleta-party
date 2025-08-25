// src/components/SimpleMinigameTemplate.tsx
'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  description: ReactNode;
  actionLabel?: string;
  actionDisabled?: boolean;         // NUEVO
  aboveAction?: ReactNode;          // NUEVO
  className?: string;
};

export default function SimpleMinigameTemplate({
  title,
  description,
  actionLabel = 'Eliminar jugador',
  actionDisabled,
  aboveAction,
  className,
}: Props) {
  const router = useRouter();

  return (
    <main className={`h-[100dvh] overflow-hidden bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white ${className ?? ''}`}>
      <div className="mx-auto max-w-2xl h-full flex flex-col p-6 gap-6">
        <header>
          <h1 className="text-4xl w-full text-center font-extrabold drop-shadow">{title}</h1>
        </header>

        <section className="flex-1 overflow-y-auto">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 leading-relaxed backdrop-blur">
            {description}
          </div>
        </section>

        {aboveAction}

        <footer className="pt-2">
          <button
            onClick={() => router.push('/elimination')}
            disabled={!!actionDisabled}
            className={`w-full rounded-xl py-3 font-semibold border shadow-lg transition
              ${actionDisabled
                ? 'bg-white/20 text-white/60 border-white/20 cursor-not-allowed'
                : 'bg-rose-500/90 hover:bg-rose-600/90 active:bg-rose-700/90 border-white/10'}`}
          >
            {actionLabel}
          </button>
        </footer>
      </div>
    </main>
  );
}
