'use client';

import { Tile as TileType } from '@/types/tile';
import Tile from './Tile';

interface GridProps {
  tiles: TileType[];
  onTileClick: (tile: TileType) => void;
}

export default function Grid({ tiles, onTileClick }: GridProps) {
  const sortedTiles = [...tiles].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  // Agrupar tiles por linha
  const rows: TileType[][] = [];
  sortedTiles.forEach(tile => {
    if (!rows[tile.row]) rows[tile.row] = [];
    rows[tile.row].push(tile);
  });

  return (
    <div className="w-full" style={{ margin: 0, padding: 0 }}>
      {rows.map((rowTiles, rowIndex) => {
        if (!rowTiles.length) return null;

        // Detectar se é Large (full width)
        if (rowTiles.length === 1 && rowTiles[0].colSpan === 4) {
          return (
            <div key={rowIndex} className="w-full">
              <Tile tile={rowTiles[0]} onClick={() => onTileClick(rowTiles[0])} />
            </div>
          );
        }

        // Detectar se são 2 Medium (half width cada)
        if (rowTiles.length === 2 && rowTiles[0].colSpan === 2) {
          return (
            <div key={rowIndex} className="grid grid-cols-2" style={{ gap: 0 }}>
              {rowTiles.map(tile => (
                <Tile key={tile.id} tile={tile} onClick={() => onTileClick(tile)} />
              ))}
            </div>
          );
        }

        // Detectar se são 4 Small (quarter width cada)
        if (rowTiles.length === 4 && rowTiles[0].colSpan === 1) {
          return (
            <div key={rowIndex} className="grid grid-cols-4" style={{ gap: 0 }}>
              {rowTiles.map(tile => (
                <Tile key={tile.id} tile={tile} onClick={() => onTileClick(tile)} />
              ))}
            </div>
          );
        }

        // Fallback
        return null;
      })}
    </div>
  );
}
