// components/RouletteLib.tsx
'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import type { Slice, SliceKey } from '@/lib/types';

type Props = {
  slices: Slice[];
  onResult: (key: SliceKey) => void;
  label: string;
  spinButtonText: string;
  disabled?: boolean;
  className?: string;
};

export default function RouletteLib({
  slices, onResult, label, spinButtonText, disabled, className,
}: Props) {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(0);
  const resultKeyRef = useRef<SliceKey | null>(null);

  const data = useMemo(
    () =>
      slices.map(s => ({
        option: s.label,
        style: { backgroundColor: s.color },
        image: { uri: s.iconSrc, sizeMultiplier: 0.8 },
      })),
    [slices]
  );

  const weightedIndex = (arr: { weight?: number }[]) => {
    if (!arr.length) return 0;
    const ws = arr.map(s => Math.max(0, s.weight ?? 1));
    const total = ws.reduce((a, b) => a + b, 0);
    if (total <= 0) return 0;
    let r = Math.random() * total;
    for (let i = 0; i < ws.length; i++) {
      r -= ws[i];
      if (r <= 0) return i;
    }
    return ws.length - 1;
  };

  const spin = useCallback(() => {
    if (spinning || disabled) return;
    if (!slices || slices.length === 0) return;
    const idx = weightedIndex(slices);
    resultKeyRef.current = slices[idx].key; // snapshot del ganador
    setPrize(idx);
    setSpinning(true);
  }, [spinning, disabled, slices]);

  return (
    <div className={className}>
      <h2 className="text-3xl font-extrabold drop-shadow">{label}</h2>

      <div>
        <Wheel
          mustStartSpinning={spinning}
          prizeNumber={prize}
          data={data}
          outerBorderColor="rgba(255,255,255,0.3)"
          outerBorderWidth={1}
          radiusLineColor="rgba(255,255,255,0.25)"
          radiusLineWidth={1}
          textDistance={75}
          fontSize={12}
          perpendicularText
          onStopSpinning={() => {
            if (resultKeyRef.current) onResult(resultKeyRef.current);
            setSpinning(false);
            resultKeyRef.current = null;
          }}
          spinDuration={0.5}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled || slices.length === 0}
        className={`mt-5 px-6 py-3 rounded-xl font-semibold border border-white/30 shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-400/40 transition
        ${spinning || disabled ? 'bg-white/30 text-white/60 cursor-not-allowed' : 'bg-rose-500/90 hover:bg-rose-600/90 active:bg-rose-700/90 border border-white/10'}`}
        aria-label={spinning ? 'Girando' : 'Girar'}
      >
        {spinning ? 'Girando…' : spinButtonText}
      </button>
    </div>
  );
}
