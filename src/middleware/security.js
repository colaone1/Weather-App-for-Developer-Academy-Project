import { randomBytes } from 'crypto';
import logger from './logger.js';

const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB
const AUTH_FAILURE_LIMIT = 5;
const AUTH_FAILURE_WINDOW = 15 * 60 * 1000; // 15 minutes

// Track authentication failures
const authFailures = new Map();

// Clean up old auth failures periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of authFailures.entries()) {
    if (now - data.timestamp > AUTH_FAILURE_WINDOW) {
      authFailures.delete(ip);
    }
  }
}, AUTH_FAILURE_WINDOW);

const security = async (ctx, next) => {
  const ip = ctx.request.ip;
  
  // Check request size
  if (ctx.request.length > MAX_REQUEST_SIZE) {
    ctx.status = 413;
    ctx.body = {
      error: {
        message: 'Request entity too large',
        status: 413,
        category: 'VALIDATION_ERROR'
      }
    };
    return;
  }
  
  // Check authentication failures
  const authData = authFailures.get(ip) || { count: 0, timestamp: Date.now() };
  if (authData.count >= AUTH_FAILURE_LIMIT) {
    const timeLeft = AUTH_FAILURE_WINDOW - (Date.now() - authData.timestamp);
    if (timeLeft > 0) {
      ctx.status = 429;
      ctx.body = {
        error: {
          message: 'Too many authentication failures',
          status: 429,
          category: 'AUTHENTICATION_ERROR',
          retryAfter: Math.ceil(timeLeft / 1000)
        }
      };
      ctx.set('Retry-After', Math.ceil(timeLeft / 1000));
      return;
    } else {
      authFailures.delete(ip);
    }
  }

  // Generate CSRF token if not exists
  if (!ctx.cookies.get('csrf-token')) {
    const csrfToken = randomBytes(32).toString('hex');
    ctx.cookies.set('csrf-token', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }

  // Security headers
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  ctx.set('X-DNS-Prefetch-Control', 'off');
  ctx.set('X-Download-Options', 'noopen');
  ctx.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Enhanced CSP with nonce
  const nonce = randomBytes(16).toString('base64');
  ctx.state.nonce = nonce;
  
  ctx.set('Content-Security-Policy', [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.openweathermap.org",
    "font-src 'self' data:",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "require-trusted-types-for 'script'"
  ].join('; '));
  
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Enhanced Permissions Policy
  ctx.set('Permissions-Policy', [
    'geolocation=(self)',
    'camera=()',
    'microphone=()',
    'payment=()',
    'usb=()',
    'fullscreen=(self)',
    'display-capture=()',
    'accelerometer=()',
    'gyroscope=()',
    'magnetometer=()',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'sync-xhr=(self)'
  ].join(', '));

  try {
    // Verify CSRF token for non-GET requests
    if (ctx.method !== 'GET') {
      const csrfToken = ctx.cookies.get('csrf-token');
      const headerToken = ctx.get('X-CSRF-Token');
      
      if (!csrfToken || !headerToken || csrfToken !== headerToken) {
        // Increment auth failure counter
        authData.count++;
        authData.timestamp = Date.now();
        authFailures.set(ip, authData);
        
        ctx.status = 403;
        ctx.body = {
          error: {
            message: 'Invalid CSRF token',
            status: 403,
            category: 'AUTHORIZATION_ERROR'
          }
        };
        return;
      }
    }
    
    await next();
  } catch (error) {
    logger.error('Security middleware error:', {
      error,
      ip,
      path: ctx.path,
      method: ctx.method
    });
    throw error;
  }
};

export default security; 