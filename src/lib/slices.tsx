import { Slice, SliceKey } from "./types";

export const SLICES: Slice[] = [
  {
    key: SliceKey.SecretCode, 
    path: '/minigames/secret-code',
    label: 'Código oculto', 
    color: '#A78BFA',
    iconSrc: '/icons/enigma.png',
    weight: 1
  },
  {
    key: SliceKey.BrokenStory, 
    path: '/minigames/broken-story',
    label: 'Historia rota',
    color: '#F472B6',
    iconSrc: '/icons/book.png',
    weight: 5
  },
  {
    key: SliceKey.HandsGame, 
    path: '/minigames/hands-game',
    label: 'Juego de manos', 
    color: '#34D399',
    iconSrc: '/icons/rock-paper-scissors.png',
    weight: 1
  },
  {
    key: SliceKey.KillTheKing, 
    path: '/minigames/kill-the-king',
    label: 'Muerte al Rey', 
    color: '#FBBF24',
    iconSrc: '/icons/king.png',
    weight: 1
  },
  {
    key: SliceKey.Revive, 
    path: '',
    label: 'De entre los muertos', 
    color: '#60A5FA',
    iconSrc: '/icons/grave.png',
    weight: 0.2
  },
];
