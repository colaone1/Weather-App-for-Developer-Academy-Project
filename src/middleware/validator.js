import logger from './logger.js';

const validateCity = (city) => {
  if (!city || typeof city !== 'string') return false;
  // Allow letters, spaces, hyphens, and apostrophes
  return /^[a-zA-Z\s\-']+$/.test(city);
};

const validateCoordinates = (lon, lat) => {
  if (!lon || !lat) return false;
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
  
  try {
    // Validate based on route
    if (ctx.path === '/api/weatherbycity') {
      const { city } = ctx.query;
      if (!city) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'City parameter is required',
            requestId,
            details: 'Please provide a city name'
          }
        };
        return;
      }
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
      if (!lon || !lat) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'Coordinates are required',
            requestId,
            details: 'Please provide both longitude and latitude'
          }
        };
        return;
      }
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
  } catch (error) {
    logger.error('Validation error:', {
      error,
      requestId,
      path: ctx.path,
      query: ctx.query
    });
    
    ctx.status = 500;
    ctx.body = {
      error: {
        message: 'Internal validation error',
        requestId,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    };
  }
};

export default validator; 