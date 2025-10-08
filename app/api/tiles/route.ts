import { NextRequest, NextResponse } from 'next/server';
import { Tile, TileSize } from '@/types/tile';
import { getRedisClient, getTileKey, extractTileId, TILE_KEY_PREFIX, RedisTileData } from '@/lib/redis';
import { seedTiles } from '@/lib/seed';

// Calcula TTL em segundos baseado no expiresAt
function calculateTTL(expiresAt: string): number {
  const expireTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const ttlMs = expireTime - now;
  
  if (ttlMs <= 0) return 0;
  
  return Math.ceil(ttlMs / 1000); // Converte para segundos
}

// Busca tiles comprados no Redis e mescla com o seed base
async function getTilesWithPurchases(): Promise<Tile[]> {
  try {
    const redis = getRedisClient();
    
    // Começa com os tiles base (seed)
    const baseTiles = seedTiles();
    
    // Busca todas as chaves de tiles comprados no Redis
    const keys = await redis.keys(`${TILE_KEY_PREFIX}*`);
    
    if (keys.length === 0) {
      // Nenhum tile comprado, retorna base
      return baseTiles;
    }
    
    // Busca todos os valores em batch
    const values = await redis.mget(...keys);
    
    // Cria map de tiles comprados
    const purchasedTiles = new Map<number, RedisTileData>();
    for (let i = 0; i < keys.length; i++) {
      if (values[i]) {
        try {
          const tileId = extractTileId(keys[i]);
          const data = JSON.parse(values[i] as string) as RedisTileData;
          purchasedTiles.set(tileId, data);
        } catch (e) {
          console.error(`Error parsing tile from key ${keys[i]}:`, e);
        }
      }
    }
    
    // Mescla: aplica dados comprados sobre os tiles base
    return baseTiles.map(tile => {
      const purchased = purchasedTiles.get(tile.id);
      if (purchased) {
        return {
          ...tile,
          text: purchased.text,
          link: purchased.link,
          expiresAt: purchased.expiresAt,
        };
      }
      return tile;
    });
  } catch (error) {
    console.error('Error getting tiles with purchases:', error);
    // Em caso de erro, retorna pelo menos o seed
    return seedTiles();
  }
}

// Salva uma compra de tile no Redis com TTL
async function savePurchaseToRedis(
  tileId: number,
  text: string,
  link: string | undefined,
  expiresAt: string
): Promise<boolean> {
  try {
    const redis = getRedisClient();
    const key = getTileKey(tileId);
    
    const data: RedisTileData = {
      text,
      link,
      expiresAt,
    };
    
    const ttl = calculateTTL(expiresAt);
    
    if (ttl <= 0) {
      console.warn(`TTL inválido para tile ${tileId}, ignorando`);
      return false;
    }
    
    // Salva com TTL (em segundos) - Redis remove automaticamente quando expirar
    await redis.setex(key, ttl, JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error(`Error saving purchase for tile ${tileId}:`, error);
    return false;
  }
}

// Encontra um tile vazio do mesmo tamanho para resolver conflito
function findAvailableTileOfSize(
  baseTiles: Tile[],
  purchasedIds: Set<number>,
  size: TileSize
): Tile | null {
  return baseTiles.find(t => t.size === size && !purchasedIds.has(t.id)) || null;
}

// GET - Retorna tiles base mesclados com compras do Redis
export async function GET() {
  try {
    const tiles = await getTilesWithPurchases();
    return NextResponse.json({ tiles, timestamp: Date.now() });
  } catch (error) {
    console.error('GET /api/tiles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tiles' },
      { status: 500 }
    );
  }
}

// POST - Salva compras de tiles ou migra do localStorage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'purchase' && body.tile) {
      // Nova compra de tile
      const { id, text, link, expiresAt } = body.tile;
      
      if (!text || !expiresAt) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      const success = await savePurchaseToRedis(id, text, link, expiresAt);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to save purchase' },
          { status: 500 }
        );
      }
      
      // Retorna todos os tiles atualizados
      const tiles = await getTilesWithPurchases();
      return NextResponse.json({ success: true, tiles });
    }
    
    if (body.action === 'init' && Array.isArray(body.tiles)) {
      // Migração do localStorage - com resolução de conflitos
      const redis = getRedisClient();
      const baseTiles = seedTiles();
      
      // Busca IDs já ocupados no Redis
      const keys = await redis.keys(`${TILE_KEY_PREFIX}*`);
      const purchasedIds = new Set(keys.map(key => extractTileId(key)));
      
      const migratedTiles: Tile[] = [];
      const conflicts: Array<{old: number, new: number}> = [];
      
      // Processa cada tile do localStorage
      for (const tile of body.tiles) {
        // Só migra tiles com conteúdo
        if (!tile.text && !tile.link) continue;
        
        // Verifica se ainda tem tempo válido
        const ttl = calculateTTL(tile.expiresAt);
        if (ttl <= 0) continue; // Expirado, ignora
        
        let targetId = tile.id;
        
        // Se o tile já está ocupado no Redis, encontra alternativa
        if (purchasedIds.has(tile.id)) {
          const available = findAvailableTileOfSize(baseTiles, purchasedIds, tile.size);
          if (available) {
            targetId = available.id;
            purchasedIds.add(targetId); // Marca como ocupado
            conflicts.push({ old: tile.id, new: targetId });
          } else {
            // Sem espaço disponível deste tamanho, ignora
            console.warn(`No available tile of size ${tile.size} for migration`);
            continue;
          }
        } else {
          purchasedIds.add(targetId);
        }
        
        // Salva no Redis com TTL restante
        await savePurchaseToRedis(
          targetId,
          tile.text,
          tile.link,
          tile.expiresAt
        );
        
        migratedTiles.push({ ...tile, id: targetId });
      }
      
      // Retorna tiles atualizados + informação sobre conflitos resolvidos
      const tiles = await getTilesWithPurchases();
      return NextResponse.json({ 
        success: true, 
        tiles,
        migrated: migratedTiles.length,
        conflicts: conflicts.length > 0 ? conflicts : undefined
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in POST /api/tiles:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

