import logger from './logger.js';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Error occurred:', err);

    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status,
        timestamp: new Date().toISOString()
      }
    };

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production') {
      ctx.body.error.message = 'An unexpected error occurred';
    }
  }
};

export default errorHandler; 