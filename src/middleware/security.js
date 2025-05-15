import { randomBytes } from 'crypto';

const security = async (ctx, next) => {
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

  // Verify CSRF token for non-GET requests
  if (ctx.method !== 'GET') {
    const csrfToken = ctx.cookies.get('csrf-token');
    const headerToken = ctx.get('X-CSRF-Token');
    
    if (!csrfToken || !headerToken || csrfToken !== headerToken) {
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
};

export default security; 