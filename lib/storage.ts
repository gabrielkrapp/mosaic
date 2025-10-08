import { Tile } from '@/types/tile';

const KEY = 'mosaic:tiles';
const VERSION_KEY = 'mosaic:version';
const MIGRATED_KEY = 'mosaic:migrated';
const CURRENT_VERSION = '3.0'; // Atualizado para nova versão com backend

// Carrega tiles do localStorage (usado apenas para migração agora)
function loadTilesFromLocalStorage(): Tile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Verifica se já foi migrado para o backend
function isMigrated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MIGRATED_KEY) === 'true';
}

// Marca como migrado
function setMigrated() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MIGRATED_KEY, 'true');
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}

// Carrega tiles do backend (API)
export async function loadTiles(): Promise<Tile[]> {
  try {
    const response = await fetch('/api/tiles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tiles from server');
    }
    
    const data = await response.json();
    return data.tiles || [];
  } catch (error) {
    console.error('Error loading tiles from backend:', error);
    // Fallback para localStorage se a API falhar
    return loadTilesFromLocalStorage();
  }
}

// Salva uma compra de tile no backend
export async function savePurchase(tile: Tile): Promise<boolean> {
  try {
    const response = await fetch('/api/tiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'purchase',
        tile: {
          id: tile.id,
          text: tile.text,
          link: tile.link,
          expiresAt: tile.expiresAt,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save purchase to server');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving purchase to backend:', error);
    return false;
  }
}

// Migra dados do localStorage para o backend
export async function migrateToBackend(): Promise<Tile[]> {
  // Se já foi migrado, apenas carrega do backend
  if (isMigrated()) {
    return loadTiles();
  }
  
  // Tenta carregar tiles do localStorage
  const localTiles = loadTilesFromLocalStorage();
  
  try {
    // Se há tiles no localStorage, tenta migrar para o backend
    if (localTiles.length > 0) {
      const response = await fetch('/api/tiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'init',
          tiles: localTiles,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to migrate tiles to server');
      }
      
      const data = await response.json();
      setMigrated();
      
      // Retorna os tiles do servidor (podem ser diferentes se já existiam)
      return data.tiles || localTiles;
    }
    
    // Se não há tiles no localStorage, apenas carrega do backend
    setMigrated();
    return loadTiles();
  } catch (error) {
    console.error('Error migrating to backend:', error);
    // Em caso de erro, continua usando localStorage
    return localTiles;
  }
}

// Reseta apenas localStorage (Redis gerencia expiração automaticamente)
export function resetLocalStorage() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY);
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(MIGRATED_KEY);
  }
}
