import logger from './logger.js';
import Redis from 'ioredis';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per window
const RETRY_AFTER = 60; // 60 seconds

// Initialize Redis client with enhanced retry strategy
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    logger.info(`Redis retry attempt ${times} with delay ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true,
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  }
});

// Track Redis connection status
let isConnected = false;
let lastError = null;

redis.on('connect', () => {
  isConnected = true;
  lastError = null;
  logger.info('Redis connected successfully');
});

redis.on('error', (err) => {
  isConnected = false;
  lastError = err;
  logger.error('Redis error:', {
    error: err,
    code: err.code,
    message: err.message,
    stack: err.stack
  });
});

redis.on('close', () => {
  isConnected = false;
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

// Cleanup Redis connection on app shutdown
process.on('SIGTERM', () => {
  redis.quit();
});

process.on('SIGINT', () => {
  redis.quit();
});

const rateLimit = new Map();

export default async (ctx, next) => {
  const ip = ctx.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // max requests per window

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
  } else {
    const userLimit = rateLimit.get(ip);
    if (now > userLimit.resetTime) {
      userLimit.count = 1;
      userLimit.resetTime = now + windowMs;
    } else if (userLimit.count >= maxRequests) {
      ctx.status = 429;
      ctx.body = { error: 'Too many requests, please try again later' };
      return;
    } else {
      userLimit.count++;
    }
  }

  await next();
}; 