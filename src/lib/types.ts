// lib/types.ts
export enum SliceKey {
  SecretCode = 'Código oculto',
  BrokenStory = 'Historia rota',
  HandsGame = 'Juego de manos',
  KillTheKing = 'Muerte al Rey',
  Revive = 'De entre los muertos',
  FinalClash = 'Riña final',
}

export type Slice = {
  key: SliceKey;
  path: string;
  label: string;
  color: string;
  iconSrc: string;
  weight?: number; // probabilidad relativa, default 1
};
