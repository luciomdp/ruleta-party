// src/store/useGameStore.ts
'use client';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import shuffle from 'lodash.shuffle';
import { STORY_SEEDS } from '@/lib/stories';

export enum Phase {
  Lobby = 'lobby',
  Roulette = 'roulette',
  Elimination = 'elimination',
  Clash = 'clash',
  End = 'end',
}

type GameState = {
  alive: string[];
  dead: string[];
  phase: Phase;
  round: number;
  setPhase: (p: Phase) => void;         
  innitGame: (names: string[]) => void;
  eliminate: (name: string) => void;
  reviveRandom: () => void;
  nextRound: () => void;
  reset: () => void;

  //___ Broken Story slice ___
  storyDeck: typeof STORY_SEEDS;
  storyIndex: number;
  currentStory: () => (typeof STORY_SEEDS)[number] | null;
  advanceStory: () => void;

  //___ Turn handling ___
  bsTurnIndex: number;                    
  bsReset: () => void;                   
  bsNext: () => void;                     
};

export const useGameStore = create<GameState>((set, get) => ({
  alive: [],
  dead: [],
  phase: Phase.Lobby,
  round: 1,

  setPhase: (p) => set({ phase: p }),

  innitGame: (names) =>
    set({
      alive: names,
      dead: [],
      phase: Phase.Roulette,
      round: 1,
      // inicializa historias al arrancar la partida
      storyDeck: shuffle(STORY_SEEDS),
      storyIndex: 0,
    }),

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

    toast.success(`${revived} fue traído desde los muertos`, {
      icon: '🧟',
    });
  },

  nextRound: () => set((s) => ({ round: s.round + 1 })),

  reset: () => set({ alive: [], dead: [], phase: Phase.Lobby, round: 1, bsTurnIndex: 0}),

  storyDeck: [] as unknown as typeof STORY_SEEDS,
  storyIndex: 0,
  currentStory: () => {
    const { storyDeck, storyIndex } = get();
    return storyDeck[storyIndex] ?? null;
  },
  advanceStory: () => {
    const { storyDeck, storyIndex } = get();
    if (storyIndex < storyDeck.length) set({ storyIndex: storyIndex + 1 });
  },
  bsTurnIndex: 0,
  bsReset: () => set({ bsTurnIndex: 0 }),
  bsNext: () => set(s => ({ bsTurnIndex: s.bsTurnIndex + 1 })),
}));
