const security = async (ctx, next) => {
  // Security headers
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // More permissive CSP that allows necessary resources
  ctx.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.openweathermap.org",
    "font-src 'self' data:",
    "media-src 'self'"
  ].join('; '));
  
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Allow geolocation for weather app functionality
  ctx.set('Permissions-Policy', 'geolocation=(self)');
  
  await next();
};

export default security; 