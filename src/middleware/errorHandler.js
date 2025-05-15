import logger from './logger.js';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Error occurred:', err);

    ctx.status = err.status || 500;
    
    // Enhanced error response
    const errorResponse = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status,
        timestamp: new Date().toISOString()
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

    ctx.body = errorResponse;

    // Set appropriate headers
    ctx.set('Content-Type', 'application/json');
    if (err.status === 429) {
      ctx.set('Retry-After', '60');
    }
  }
};

export default errorHandler; 