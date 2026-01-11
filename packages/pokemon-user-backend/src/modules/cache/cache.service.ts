import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import type LRUCache from 'lru-cache';

// CommonJS-style guard (in TS file)
const LRUImport = require('lru-cache');
const LRUCacheClass = (LRUImport.default ?? LRUImport) as unknown as {
  new <K, V>(options?: any): LRUCache<K, V>
};

@Injectable()
export class LocalCacheService {
  private cache = new LRUCacheClass<string, unknown>({
    max: 500,
    ttl: 60_000,
  });

  
  constructor(private readonly logger: PinoLogger) {
    this.logger.info({ max: 500, ttl: '60s' }, 'Initialized LocalCacheService with LRU + TTL');
  }


  get<T>(key: string): T | undefined {
    const value = this.cache.get(key) as T | undefined;
    this.logger.debug({ key, hit: value !== undefined }, 'Cache GET');
    return value;
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    if (ttlMs !== undefined) {
        this.cache.set(key, value, { ttl: ttlMs });
    } else {
        this.cache.set(key, value); // default TTL from constructor
    }
    this.logger.debug({ key, ttlMs }, 'Cache SET');
  }

  delete(key: string) {
    this.cache.delete(key);
    this.logger.debug({ key }, 'Cache DELETE');
  }

  reset() {
    this.cache.clear();
    this.logger.info('Cache RESET');
  }

  // Returns keys in LRU order (most recently used first)
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Shallow snapshot suitable for logging (only serializes values that are JSON-friendly)
  dump(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of this.cache.keys()) {
      const value = this.cache.get(key);
      try {
        result[key] = JSON.parse(JSON.stringify(value));
      } catch {
        result[key] = '[unserializable]';
      }
    }
    this.logger.info({ size: this.size() }, 'Cache DUMP snapshot');
    return result;
  }

  // number of entries currently in cache
  size(): number {
    const explicitSize = (this.cache as any).size;
    if (typeof explicitSize === 'number') return explicitSize;
    return Array.from(this.cache.keys()).length;
  }

  // does a key exist without retrieving it
  has(key: string): boolean {
    const exists = this.cache.has(key);
    this.logger.debug({ key, exists }, 'Cache HAS');
    return exists;
  }
}