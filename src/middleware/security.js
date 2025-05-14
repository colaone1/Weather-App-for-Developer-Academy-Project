const security = async (ctx, next) => {
  // Security headers
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  ctx.set('Content-Security-Policy', "default-src 'self'");
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  ctx.set('Permissions-Policy', 'geolocation=()');
  
  await next();
};

export default security; 