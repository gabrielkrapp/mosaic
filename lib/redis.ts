import Redis from 'ioredis';

// Singleton do cliente Redis
let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redis.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  return redis;
}

// Chave base para os tiles
export const TILE_KEY_PREFIX = 'mosaic:tile:';

// Tipo simplificado para dados no Redis (só o essencial)
export type RedisTileData = {
  text: string;
  link?: string;
  expiresAt: string;
};

// Função helper para criar chave de um tile
export function getTileKey(tileId: number): string {
  return `${TILE_KEY_PREFIX}${tileId}`;
}

// Função helper para extrair ID da chave
export function extractTileId(key: string): number {
  return parseInt(key.replace(TILE_KEY_PREFIX, ''), 10);
}

