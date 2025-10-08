export type TileSize = 'S' | 'M' | 'L';

export type Tile = {
  id: number; // 1..100
  size: TileSize; // S/M/L
  text?: string; // limited by size
  link?: string; // optional
  expiresAt?: string; // ISO - when occupied
  row: number; // grid row position
  col: number; // grid col position
  rowSpan: number; // 1 or 2
  colSpan: number; // 1 or 2
};

