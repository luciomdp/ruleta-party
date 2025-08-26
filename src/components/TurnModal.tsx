// src/components/TurnModal.tsx
'use client';

type Props = {
  open: boolean;
  playerName: string;
  story?: string;
  timeLeft: number;
  onSkip: () => void;
};

export default function TurnModal({ open, playerName, story, timeLeft, onSkip }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="relative w-full max-w-sm rounded-2xl border border-white/20 p-6 text-white shadow-2xl backdrop-blur bg-white/10">
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

        {/* Botón skip abajo derecha */}
        <button
          onClick={onSkip}
          className="absolute bottom-4 right-4 text-white/70 hover:text-white"
          aria-label="Saltar turno"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 4v16l10-8-10-8zm11 0v16h3V4h-3z" />
          </svg>
        </button>

      </div>
    </div>
  );
}
