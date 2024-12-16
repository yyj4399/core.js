import { logger, logger_app, logger_sql } from "#src/core/logger.mjs";

import { createClient } from "npm:redis";

// 创建redis客户端
const client = createClient({
  // 主机
  url: 'redis://redis',
  // 超时关闭
  connectTimeout: 10000,
});

// 捕获错误
client.on('error', error => {
  logger_app.trace(`Redis client error:`, error)
});

// 建立连接
await client.connect();

export const cache_func = {
  /**
   * 设置缓存
   * @param {String} key key
   * @param {String} value value
   * @param {Number} expire 有效期(s)
   */
  set: async (key = '', value = '', expire = 0) => {
    expire = Math.floor(expire);

    // 缓存
    await client.set(key, value);

    // 缓存有效期
    if (expire > 0) {
      await client.expire(key, expire);
    }
  },
  get: async (key = '') => {
    let value = await client.get(key);

    return value;
  },
  del: async (key = '') => {
    await client.del(key);
  },
};

export const redisClient = client;
