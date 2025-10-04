import { Tile } from '@/types/tile';

const KEY = 'mosaic:tiles';
const VERSION_KEY = 'mosaic:version';
const CURRENT_VERSION = '2.0';

export function loadTiles(): Tile[] {
  if (typeof window === 'undefined') return [];
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      localStorage.removeItem(KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return [];
    }
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTiles(tiles: Tile[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(tiles));
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}

export function resetTiles() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(VERSION_KEY);
}
