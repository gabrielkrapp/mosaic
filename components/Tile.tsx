'use client';

import { Tile as TileType } from '@/types/tile';

interface TileProps {
  tile: TileType;
  onClick: () => void;
}

export default function Tile({ tile, onClick }: TileProps) {
  const isOccupied = !!tile.text;

  const getSizeClasses = () => {
    if (tile.size === 'L') {
      return 'h-[200px] text-3xl font-bold';
    } else if (tile.size === 'M') {
      return 'h-[140px] text-xl font-semibold';
    } else {
      return 'h-[100px] text-base font-medium';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full ${getSizeClasses()}
        flex items-center justify-center text-center p-4
        transition-colors duration-200 border border-gray-800
        ${isOccupied
          ? 'bg-white text-black hover:bg-gray-100'
          : 'bg-gray-900 text-gray-600 hover:bg-gray-800'
        }
      `}
    >
      {isOccupied ? (
        <div className="px-2">
          {tile.text}
        </div>
      ) : (
        <div className="text-gray-700">
          +
        </div>
      )}
    </button>
  );
}
