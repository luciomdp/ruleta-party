// src/store/useGameStore.ts
'use client';
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { STORY_SEEDS } from '@/lib/stories';

const shuffle = <T,>(a: T[]) => { 
  for (let i=a.length-1;i>0;i--){ 
    const j=Math.floor(Math.random()*(i+1)); 
    [a[i],a[j]]=[a[j],a[i]]; 
  } 
  return a; 
};

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
  setNames: (names: string[]) => void;
  eliminate: (name: string) => void;
  reviveRandom: () => void;
  nextRound: () => void;
  reset: () => void;

  // --- Broken Story slice ---
  storyDeck: number[];
  currentStory?: string;
  storyDrawn: boolean;          
  drawStorySeed: () => string; 
  bsTurnIndex: number;                    // NUEVO
  bsReset: () => void;                    // NUEVO
  bsNext: () => void;                     // NUEVO
};

export const useGameStore = create<GameState>((set, get) => ({
  alive: [],
  dead: [],
  phase: Phase.Lobby,
  round: 1,

  setPhase: (p) => set({ phase: p }),

  setNames: (names) =>
    set({ alive: names, dead: [], phase: Phase.Roulette, round: 1, storyDrawn: false }),

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

  reset: () => set({ alive: [], dead: [], phase: Phase.Lobby, round: 1, storyDrawn: false }),

  storyDeck: shuffle([...Array(STORY_SEEDS.length).keys()]),
  currentStory: undefined,
  storyDrawn: false,

  drawStorySeed: () => {
    const { storyDrawn, storyDeck } = get();

    // si ya se sorteó una, devolvemos la actual
    if (storyDrawn) {
      return get().currentStory ?? '';
    }

    let deck = storyDeck;
    if (deck.length === 0) deck = shuffle([...Array(STORY_SEEDS.length).keys()]);
    const [idx, ...rest] = deck;
    const text = STORY_SEEDS[idx];
    set({ storyDeck: rest, currentStory: text, storyDrawn: true });
    return text;
  },
  bsTurnIndex: 0,
  bsReset: () => set({ bsTurnIndex: 0 }),
  bsNext: () => set(s => ({ bsTurnIndex: s.bsTurnIndex + 1 })),
}));
