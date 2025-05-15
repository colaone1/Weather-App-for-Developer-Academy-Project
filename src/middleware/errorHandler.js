import logger from './logger.js';

// Error categories
const ERROR_CATEGORIES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE: 'EXTERNAL_SERVICE_ERROR',
  INTERNAL: 'INTERNAL_SERVER_ERROR'
};

// Map HTTP status codes to error categories
const STATUS_TO_CATEGORY = {
  400: ERROR_CATEGORIES.VALIDATION,
  401: ERROR_CATEGORIES.AUTHENTICATION,
  403: ERROR_CATEGORIES.AUTHORIZATION,
  404: ERROR_CATEGORIES.NOT_FOUND,
  429: ERROR_CATEGORIES.RATE_LIMIT,
  500: ERROR_CATEGORIES.INTERNAL,
  502: ERROR_CATEGORIES.EXTERNAL_SERVICE,
  503: ERROR_CATEGORIES.EXTERNAL_SERVICE,
  504: ERROR_CATEGORIES.EXTERNAL_SERVICE
};

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Error occurred:', {
      error: err,
      requestId: ctx.state.requestId,
      path: ctx.path,
      method: ctx.method,
      query: ctx.query,
      body: ctx.request.body
    });

    // Determine error category
    const status = err.status || 500;
    const category = STATUS_TO_CATEGORY[status] || ERROR_CATEGORIES.INTERNAL;
    
    // Enhanced error response
    const errorResponse = {
      error: {
        message: err.message || 'Internal Server Error',
        status,
        category,
        timestamp: new Date().toISOString(),
        requestId: ctx.state.requestId
      }
    };

    // Add more details in development mode
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.error.details = {
        name: err.name,
        stack: err.stack,
        code: err.code,
        path: ctx.path,
        method: ctx.method,
        query: ctx.query,
        body: ctx.request.body
      };
    }

    ctx.status = status;
    ctx.body = errorResponse;

    // Set appropriate headers
    ctx.set('Content-Type', 'application/json');
    if (status === 429) {
      ctx.set('Retry-After', '60');
    }
    
    // Add error category header
    ctx.set('X-Error-Category', category);
  }
};

export default errorHandler; 