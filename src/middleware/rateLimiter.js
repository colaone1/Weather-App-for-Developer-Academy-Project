import logger from './logger.js';
import Redis from 'ioredis';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per window

// Initialize Redis client with retry strategy
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

// Cleanup Redis connection on app shutdown
process.on('SIGTERM', () => {
  redis.quit();
});

process.on('SIGINT', () => {
  redis.quit();
});

const rateLimiter = async (ctx, next) => {
  const ip = ctx.request.ip;
  const now = Date.now();
  const key = `ratelimit:${ip}`;
  
  try {
    // Get current count from Redis
    const count = await redis.get(key);
    const currentCount = count ? parseInt(count, 10) : 0;
    
    // Check if rate limit is exceeded
    if (currentCount >= MAX_REQUESTS) {
      const ttl = await redis.ttl(key);
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      ctx.status = 429;
      ctx.body = {
        error: {
          message: 'Too many requests, please try again later',
          retryAfter: ttl,
          requestId: ctx.state.requestId
        }
      };
      return;
    }
    
    // Increment counter and set expiry if not exists
    const multi = redis.multi();
    multi.incr(key);
    if (currentCount === 0) {
      multi.expire(key, Math.ceil(WINDOW_MS / 1000));
    }
    await multi.exec();
    
    // Add rate limit headers
    ctx.set('X-RateLimit-Limit', MAX_REQUESTS);
    ctx.set('X-RateLimit-Remaining', MAX_REQUESTS - (currentCount + 1));
    ctx.set('X-RateLimit-Reset', Math.ceil((now + WINDOW_MS) / 1000));
    
    await next();
  } catch (error) {
    logger.error('Rate limiter error:', error);
    // If Redis fails, allow the request but log the error
    await next();
  }
};

export default rateLimiter; 