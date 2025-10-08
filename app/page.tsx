'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tile } from '@/types/tile';
import { migrateToBackend, loadTiles, savePurchase } from '@/lib/storage';
import { daysFromNowISO } from '@/lib/time';
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

  // Função para carregar tiles do backend
  const fetchTiles = useCallback(async () => {
    try {
      const loadedTiles = await loadTiles();
      setTiles(loadedTiles);
      return loadedTiles;
    } catch (error) {
      console.error('Error fetching tiles:', error);
      return [];
    }
  }, []);

  // Inicialização e migração
  useEffect(() => {
    async function initialize() {
      try {
        // Tenta migrar dados do localStorage para o backend (se existirem)
        const loadedTiles = await migrateToBackend();
        setTiles(loadedTiles);
      } catch (error) {
        console.error('Error initializing:', error);
        setToast({ 
          message: 'Failed to load tiles. Please refresh the page.', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  // Polling para atualizações em tempo real (a cada 5 segundos)
  useEffect(() => {
    if (loading) return;

    const pollingInterval = setInterval(async () => {
      await fetchTiles();
    }, 5000);

    return () => clearInterval(pollingInterval);
  }, [loading, fetchTiles]);

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

  const handlePurchase = async (tile: Tile, text: string, link: string, days: number) => {
    const purchasedTile: Tile = {
      ...tile,
      text,
      link: link || undefined,
      ownerMasked: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
      expiresAt: daysFromNowISO(days),
    };

    // Atualiza localmente primeiro (UI otimista)
    setTiles(prevTiles => 
      prevTiles.map(t => t.id === tile.id ? purchasedTile : t)
    );
    
    // Salva no Redis (só este tile)
    const success = await savePurchase(purchasedTile);
    
    if (success) {
      setToast({ message: '✓ Advertisement activated!', type: 'success' });
      // Recarrega para garantir sincronização
      await fetchTiles();
    } else {
      setToast({ message: '⚠ Failed to save. Please try again.', type: 'error' });
      // Reverte update otimista
      await fetchTiles();
    }
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
