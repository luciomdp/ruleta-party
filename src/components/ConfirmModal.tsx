// src/components/ConfirmModal.tsx
'use client';

import { ReactNode } from 'react';
import { glassBtn } from '@/ui/theme';

type Props = {
  title: string;
  subtitle: string | ReactNode;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function ConfirmModal({ title, subtitle, onCancel, onSuccess }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-rose-500/90 text-white border border-white/20 shadow-2xl backdrop-blur-md p-5">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-white/90">{subtitle}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className={`px-4 py-2 ${glassBtn}`}>
            No
          </button>
          <button
            onClick={onSuccess}
            className={`px-4 py-2 ${glassBtn}`}>
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}
