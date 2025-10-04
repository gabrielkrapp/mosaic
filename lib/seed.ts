import { Tile } from '@/types/tile';

// MEGA GRID: 64 banners com variedade
// Grid base: 4 colunas

export function seedTiles(): Tile[] {
  const tiles: Tile[] = [];
  let tileId = 1;
  let rowIndex = 0;

  // === PATTERN 1: Large + Small ===
  tiles.push({ id: tileId++, size: 'L', row: rowIndex, col: 0, rowSpan: 1, colSpan: 4 });
  rowIndex++;
  
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 2: Medium x 2 ===
  for (let i = 0; i < 2; i++) {
    tiles.push({ id: tileId++, size: 'M', row: rowIndex, col: i * 2, rowSpan: 1, colSpan: 2 });
  }
  rowIndex++;

  // === PATTERN 3: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 4: Large ===
  tiles.push({ id: tileId++, size: 'L', row: rowIndex, col: 0, rowSpan: 1, colSpan: 4 });
  rowIndex++;

  // === PATTERN 5: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 6: Medium x 2 ===
  for (let i = 0; i < 2; i++) {
    tiles.push({ id: tileId++, size: 'M', row: rowIndex, col: i * 2, rowSpan: 1, colSpan: 2 });
  }
  rowIndex++;

  // === PATTERN 7: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 8: Medium x 2 ===
  for (let i = 0; i < 2; i++) {
    tiles.push({ id: tileId++, size: 'M', row: rowIndex, col: i * 2, rowSpan: 1, colSpan: 2 });
  }
  rowIndex++;

  // === PATTERN 9: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 10: Large ===
  tiles.push({ id: tileId++, size: 'L', row: rowIndex, col: 0, rowSpan: 1, colSpan: 4 });
  rowIndex++;

  // === PATTERN 11: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 12: Medium x 2 ===
  for (let i = 0; i < 2; i++) {
    tiles.push({ id: tileId++, size: 'M', row: rowIndex, col: i * 2, rowSpan: 1, colSpan: 2 });
  }
  rowIndex++;

  // === PATTERN 13: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 14: Large ===
  tiles.push({ id: tileId++, size: 'L', row: rowIndex, col: 0, rowSpan: 1, colSpan: 4 });
  rowIndex++;

  // === PATTERN 15: Medium x 2 ===
  for (let i = 0; i < 2; i++) {
    tiles.push({ id: tileId++, size: 'M', row: rowIndex, col: i * 2, rowSpan: 1, colSpan: 2 });
  }
  rowIndex++;

  // === PATTERN 16: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 17: Medium x 2 ===
  for (let i = 0; i < 2; i++) {
    tiles.push({ id: tileId++, size: 'M', row: rowIndex, col: i * 2, rowSpan: 1, colSpan: 2 });
  }
  rowIndex++;

  // === PATTERN 18: Small x 4 ===
  for (let i = 0; i < 4; i++) {
    tiles.push({ id: tileId++, size: 'S', row: rowIndex, col: i, rowSpan: 1, colSpan: 1 });
  }
  rowIndex++;

  // === PATTERN 19: Large FINAL ===
  tiles.push({ id: tileId++, size: 'L', row: rowIndex, col: 0, rowSpan: 1, colSpan: 4 });

  // Total: 64 empty banners ready for purchase
  // 5 Large, 10 Medium, 49 Small

  return tiles;
}
