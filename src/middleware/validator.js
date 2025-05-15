import logger from './logger.js';

const validateCity = (city) => {
  if (!city || typeof city !== 'string') {
    return false;
  }
  // Basic city name validation (letters, spaces, hyphens, and apostrophes)
  return /^[a-zA-Z\s\-']+$/.test(city);
};

const validateCoordinates = (lon, lat) => {
  const lonNum = parseFloat(lon);
  const latNum = parseFloat(lat);
  
  return !isNaN(lonNum) && !isNaN(latNum) &&
         lonNum >= -180 && lonNum <= 180 &&
         latNum >= -90 && latNum <= 90;
};

const validator = async (ctx, next) => {
  const requestId = Math.random().toString(36).substring(7);
  ctx.state.requestId = requestId;
  
  // Add request ID to response headers
  ctx.set('X-Request-ID', requestId);
  
  // Validate based on route
  if (ctx.path === '/api/weatherbycity') {
    const { city } = ctx.query;
    if (!validateCity(city)) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: 'Invalid city name',
          requestId,
          details: 'City name should contain only letters, spaces, hyphens, and apostrophes'
        }
      };
      return;
    }
  }
  
  if (ctx.path === '/api/weatherbycoordinates' || ctx.path === '/api/forecastbycoordinates') {
    const { lon, lat } = ctx.query;
    if (!validateCoordinates(lon, lat)) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: 'Invalid coordinates',
          requestId,
          details: 'Longitude must be between -180 and 180, latitude between -90 and 90'
        }
      };
      return;
    }
  }
  
  // Log request details
  logger.info({
    message: 'Request received',
    requestId,
    method: ctx.method,
    path: ctx.path,
    query: ctx.query,
    ip: ctx.ip
  });
  
  await next();
};

export default validator; 