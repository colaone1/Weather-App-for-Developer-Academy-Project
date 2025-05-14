import logger from './logger.js';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // 100 requests per window

const requestStore = new Map();

const rateLimiter = async (ctx, next) => {
  const ip = ctx.request.ip;
  const now = Date.now();
  
  // Clean up old entries
  for (const [key, value] of requestStore.entries()) {
    if (now - value.timestamp > WINDOW_MS) {
      requestStore.delete(key);
    }
  }
  
  // Get or create request count for this IP
  const requestData = requestStore.get(ip) || { count: 0, timestamp: now };
  
  // Check if rate limit is exceeded
  if (requestData.count >= MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    ctx.status = 429;
    ctx.body = {
      error: {
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((requestData.timestamp + WINDOW_MS - now) / 1000)
      }
    };
    return;
  }
  
  // Update request count
  requestData.count += 1;
  requestStore.set(ip, requestData);
  
  // Add rate limit headers
  ctx.set('X-RateLimit-Limit', MAX_REQUESTS);
  ctx.set('X-RateLimit-Remaining', MAX_REQUESTS - requestData.count);
  ctx.set('X-RateLimit-Reset', Math.ceil((requestData.timestamp + WINDOW_MS) / 1000));
  
  await next();
};

export default rateLimiter; 