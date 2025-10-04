'use client';

import { useState, useEffect } from 'react';
import { Tile } from '@/types/tile';
import { loadTiles, saveTiles } from '@/lib/storage';
import { seedTiles } from '@/lib/seed';
import { daysFromNowISO, msUntil } from '@/lib/time';
import Header from '@/components/Header';
import Grid from '@/components/Grid';
import TileSheet from '@/components/TileSheet';
import Toast from '@/components/Toast';
import { MiniKit } from '@worldcoin/minikit-js';

export default function Home() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedTiles = loadTiles();
    if (loadedTiles.length === 0) {
      loadedTiles = seedTiles();
      saveTiles(loadedTiles);
    }

    const cleanedTiles = loadedTiles.map(tile => {
      if (tile.expiresAt && msUntil(tile.expiresAt) <= 0) {
        return {
          ...tile,
          text: undefined,
          link: undefined,
          ownerMasked: undefined,
          expiresAt: undefined,
        };
      }
      return tile;
    });

    setTiles(cleanedTiles);
    saveTiles(cleanedTiles);
    setLoading(false);

    const interval = setInterval(() => {
      setTiles(prevTiles => {
        const updatedTiles = prevTiles.map(tile => {
          if (tile.expiresAt && msUntil(tile.expiresAt) <= 0) {
            return {
              ...tile,
              text: undefined,
              link: undefined,
              ownerMasked: undefined,
              expiresAt: undefined,
            };
          }
          return tile;
        });
        saveTiles(updatedTiles);
        return updatedTiles;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleTileClick = (tile: Tile) => {
    setSelectedTile(tile);

    if (typeof window !== 'undefined' && window.MiniKit && MiniKit.isInstalled()) {
      try {
        MiniKit.commandsAsync.sendHapticFeedback({
          hapticsType: 'impact',
          style: 'light',
        });
      } catch (e) {
        // Ignore
      }
    }
  };

  const handlePurchase = (tile: Tile, text: string, link: string, days: number) => {
    const updatedTiles = tiles.map(t => {
      if (t.id === tile.id) {
        return {
          ...t,
          text,
          link: link || undefined,
          ownerMasked: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
          expiresAt: daysFromNowISO(days),
        };
      }
      return t;
    });

    setTiles(updatedTiles);
    saveTiles(updatedTiles);
    setToast({ message: '✓ Advertisement activated!', type: 'success' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" style={{ margin: 0, padding: 0 }}>
      <Header />

      <main style={{ padding: 0, margin: 0 }}>
        <Grid tiles={tiles} onTileClick={handleTileClick} />
      </main>

      {selectedTile && (
        <TileSheet
          tile={selectedTile}
          onClose={() => setSelectedTile(null)}
          onPurchase={handlePurchase}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
