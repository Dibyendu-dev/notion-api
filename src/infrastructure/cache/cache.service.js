import { redisClient } from "./redis.connection.js";

export class CacheService {
  async get(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, ttl = 60) {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  }

  async del(key) {
    await redisClient.del(key);
  }

  async delPattern(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
}

export const cacheService = new CacheService();
