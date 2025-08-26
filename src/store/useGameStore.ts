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
  initGame: (names: string[]) => void;
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

  initGame: (names) => {
    const order = shuffle([...names]);

    const nextName = (() => {
      let i = 0;
      return () => [
        order[i++ % order.length],
        order[i++ % order.length],
        order[i++ % order.length],
      ];
    })();


    const deck = shuffle(STORY_SEEDS).map(tpl => {
      const [n1, n2, n3] = nextName();
      return tpl
        .replace(/<1>/g, n1 ?? 'Leo Messi')
        .replace(/<2>/g, n2 ?? 'Michael Jackson')
        .replace(/<3>/g, n3 ?? 'Donald Trump');
    });

    set({ alive: names, dead: [], phase: Phase.Roulette, round: 1, storyDeck: deck, storyIndex: 0 });
  },

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
    const story = storyDeck[storyIndex] ?? null;
    if(!story) return 'Inventá tu propia historia!';
    
    return story;
  },
  advanceStory: () => {
    const { storyDeck, storyIndex } = get();
    if (storyIndex < storyDeck.length) set({ storyIndex: storyIndex + 1 });
  },
  bsTurnIndex: 0,
  bsReset: () => set({ bsTurnIndex: 0 }),
  bsNext: () => set(s => ({ bsTurnIndex: s.bsTurnIndex + 1 })),
}));
