// src/components/TurnModal.tsx
'use client';

type Props = {
  open: boolean;
  playerName: string;
  story?: string;
  timeLeft: number;
};

export default function TurnModal({ open, playerName, story, timeLeft }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 p-6 text-white shadow-2xl backdrop-blur bg-white/10">
        <h1 className="mb-3 text-2xl text-center opacity-85">
          Turno de <span className="font-semibold">{playerName}</span>
        </h1>

        <div className="rounded-xl bg-white/10 border border-white/20 p-4 mb-4">
          <div className="relative">
            <span className="absolute -left-2 -top-4 text-5xl text-white/20 select-none">“</span>
            <blockquote className="text-lg pl-4">{story ?? '…'}</blockquote>
          </div>
        </div>

        <div className="text-center text-5xl font-bold tabular-nums">{timeLeft}s</div>

      </div>
    </div>
  );
}
