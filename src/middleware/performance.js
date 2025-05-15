import logger from './logger.js';
import { performance } from 'perf_hooks';

const performanceMonitor = async (ctx, next) => {
  const start = performance.now();
  const startMemory = process.memoryUsage();
  
  try {
    await next();
  } finally {
    const end = performance.now();
    const endMemory = process.memoryUsage();
    const duration = end - start;
    
    // Calculate memory usage
    const memoryUsage = {
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external,
      rss: endMemory.rss - startMemory.rss
    };
    
    // Log performance metrics
    logger.info({
      message: 'Request performance metrics',
      requestId: ctx.state.requestId,
      method: ctx.method,
      path: ctx.path,
      duration: `${duration.toFixed(2)}ms`,
      memoryUsage,
      status: ctx.status
    });
    
    // Add performance headers
    ctx.set('X-Response-Time', `${duration.toFixed(2)}ms`);
    ctx.set('X-Memory-Usage', `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
    
    // Alert on slow requests
    if (duration > 1000) {
      logger.warn({
        message: 'Slow request detected',
        requestId: ctx.state.requestId,
        duration: `${duration.toFixed(2)}ms`,
        path: ctx.path
      });
    }
    
    // Alert on high memory usage
    if (memoryUsage.heapUsed > 50 * 1024 * 1024) { // 50MB
      logger.warn({
        message: 'High memory usage detected',
        requestId: ctx.state.requestId,
        memoryUsage: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        path: ctx.path
      });
    }
  }
};

export default performanceMonitor; 