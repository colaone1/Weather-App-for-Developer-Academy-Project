import logger from './logger.js';

const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const MAX_QUERY_LENGTH = 1000; // 1000 characters

// Input sanitization functions
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

const sanitizeNumber = (num) => {
  if (typeof num === 'number') return num;
  const parsed = parseFloat(num);
  return isNaN(parsed) ? null : parsed;
};

// Validation functions
const validateCity = (city) => {
  const sanitized = sanitizeString(city);
  return /^[a-zA-Z\s\-']+$/.test(sanitized) && sanitized.length <= 100;
};

const validateCoordinates = (lon, lat) => {
  const sanitizedLon = sanitizeNumber(lon);
  const sanitizedLat = sanitizeNumber(lat);
  
  return (
    sanitizedLon !== null &&
    sanitizedLat !== null &&
    sanitizedLon >= -180 &&
    sanitizedLon <= 180 &&
    sanitizedLat >= -90 &&
    sanitizedLat <= 90
  );
};

const validateQueryLength = (query) => {
  return Object.values(query).every(value => 
    typeof value === 'string' && value.length <= MAX_QUERY_LENGTH
  );
};

const validator = async (ctx, next) => {
  const requestId = Math.random().toString(36).substring(7);
  ctx.state.requestId = requestId;
  
  // Add request ID to response headers
  ctx.set('X-Request-ID', requestId);
  
  try {
    // Validate request body size
    if (ctx.request.length > MAX_BODY_SIZE) {
      ctx.status = 413;
      ctx.body = {
        error: {
          message: 'Request entity too large',
          requestId,
          details: `Maximum request size is ${MAX_BODY_SIZE / 1024 / 1024}MB`
        }
      };
      return;
    }
    
    // Validate query parameters length
    if (!validateQueryLength(ctx.query)) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: 'Query parameters too long',
          requestId,
          details: `Maximum query parameter length is ${MAX_QUERY_LENGTH} characters`
        }
      };
      return;
    }
    
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
      
      const sanitizedCity = sanitizeString(city);
      if (!validateCity(sanitizedCity)) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'Invalid city name',
            requestId,
            details: 'City name should contain only letters, spaces, hyphens, and apostrophes (max 100 characters)'
          }
        };
        return;
      }
      
      // Update query with sanitized value
      ctx.query.city = sanitizedCity;
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
      
      const sanitizedLon = sanitizeNumber(lon);
      const sanitizedLat = sanitizeNumber(lat);
      
      if (!validateCoordinates(sanitizedLon, sanitizedLat)) {
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
      
      // Update query with sanitized values
      ctx.query.lon = sanitizedLon;
      ctx.query.lat = sanitizedLat;
    }
    
    // Log request details
    logger.info({
      message: 'Request received',
      requestId,
      method: ctx.method,
      path: ctx.path,
      query: ctx.query,
      ip: ctx.ip,
      userAgent: ctx.get('User-Agent')
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