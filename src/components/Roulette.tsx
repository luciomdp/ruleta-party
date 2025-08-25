// components/RouletteLib.tsx
'use client';
import { useMemo, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import type { Slice, SliceKey } from '@/lib/types';

type Props = {
  slices: Slice[];                 // { key, label, color, iconSrc } -> ver nota abajo
  onResult: (key: SliceKey) => void;
  label: string;                   // visible
  spinButtonText: string;          // visible
  disabled?: boolean;
  className?: string;
};

export default function RouletteLib({
  slices, onResult, label, spinButtonText, disabled, className,
}: Props) {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(0);

  // map a formato de la lib
  const data = useMemo(
    () =>
      slices.map(s => ({
        option: s.label,                            // texto visible
        style: { backgroundColor: s.color },        // color del slice
        image: { uri: s.iconSrc, sizeMultiplier: 0.8 }, // icono como imagen
      })),
    [slices]
  );

  const spin = () => {
    if (spinning || disabled) return;
    const idx = Math.floor(Math.random() * slices.length);
    setPrize(idx);
    setSpinning(true);
  };

  return (
    <div className={className}>
        <h2 className="text-3xl font-extrabold drop-shadow">{label}</h2>

        <div className="relative w-72 h-72">
            
            <Wheel
            mustStartSpinning={spinning}
            prizeNumber={prize}
            data={data}
            outerBorderColor="rgba(255,255,255,0.3)"
            outerBorderWidth={1}
            radiusLineColor="rgba(255,255,255,0.25)"
            radiusLineWidth={1}
            textDistance={75}          // aleja el label del centro
            fontSize={12}
            perpendicularText={true}   // mejora legibilidad
            onStopSpinning={() => {
                onResult(slices[prize].key);
                setSpinning(false);
            }}
            startingOptionIndex={0}
            spinDuration={0.1}
            />
        </div>

        <button
            onClick={spin}
            disabled={spinning || disabled}
            className={`mt-5 px-6 py-3 rounded-xl font-semibold border border-white/30 shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-400/40 transition
            ${spinning || disabled ? 'bg-white/30 text-white/60 cursor-not-allowed' : 'bg-rose-500/90 hover:bg-rose-600/90 active:bg-rose-700/90 border border-white/10'}`}
            aria-label={spinning ? 'Girando' : 'Girar'}
        >
            {spinning ? 'Girando…' : spinButtonText}
        </button>
    </div>
  );
}
