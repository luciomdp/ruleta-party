'use client';
import { create } from 'zustand';

type Phase = 'lobby' | 'roulette' | 'elimination' | 'clash' | 'end';

type GameState = {
  alive: string[];
  dead: string[];
  phase: Phase;
  round: number;
  setNames: (names: string[]) => void;
  eliminate: (name: string) => void;
  reviveRandom: () => void;
  nextRound: () => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  alive: [],
  dead: [],
  phase: 'lobby',
  round: 1,

  setNames: (names) => set({ alive: names, dead: [], phase: 'roulette', round: 1 }),

  eliminate: (name) =>
    set((s) => ({
      alive: s.alive.filter((p) => p !== name),
      dead: [...s.dead, name],
    })),

  reviveRandom: () => {
    const { dead } = get();
    if (!dead.length) return;
    const idx = Math.floor(Math.random() * dead.length);
    const revived = dead[idx];
    set((s) => ({
      alive: [...s.alive, revived],
      dead: s.dead.filter((_, i) => i !== idx),
    }));
  },

  nextRound: () => set((s) => ({ round: s.round + 1 })),

  reset: () => set({ alive: [], dead: [], phase: 'lobby', round: 1 }),
}));
