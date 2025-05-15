import logger from './logger.js';
import { performance } from 'perf_hooks';

const SLOW_REQUEST_THRESHOLD = 1000; // 1 second
const HIGH_MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB
const HIGH_CPU_THRESHOLD = 70; // 70%

const performanceMonitor = async (ctx, next) => {
  const start = performance.now();
  const startMemory = process.memoryUsage();
  const startCpu = process.cpuUsage();
  
  try {
    await next();
  } finally {
    const end = performance.now();
    const endMemory = process.memoryUsage();
    const endCpu = process.cpuUsage(startCpu);
    
    const duration = end - start;
    const memoryUsage = endMemory.heapUsed - startMemory.heapUsed;
    const cpuUsage = (endCpu.user + endCpu.system) / 1000; // Convert to milliseconds
    
    // Calculate memory usage percentage
    const memoryUsagePercent = (endMemory.heapUsed / endMemory.heapTotal) * 100;
    
    // Log performance metrics
    logger.info({
      message: 'Request performance metrics',
      requestId: ctx.state.requestId,
      method: ctx.method,
      path: ctx.path,
      duration: `${duration.toFixed(2)}ms`,
      memoryUsage: `${(memoryUsage / 1024 / 1024).toFixed(2)}MB`,
      memoryUsagePercent: `${memoryUsagePercent.toFixed(2)}%`,
      cpuUsage: `${cpuUsage.toFixed(2)}ms`,
      status: ctx.status
    });
    
    // Set performance headers
    ctx.set('X-Response-Time', `${duration.toFixed(2)}ms`);
    ctx.set('X-Memory-Usage', `${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    ctx.set('X-CPU-Usage', `${cpuUsage.toFixed(2)}ms`);
    
    // Alert on slow requests
    if (duration > SLOW_REQUEST_THRESHOLD) {
      logger.warn({
        message: 'Slow request detected',
        requestId: ctx.state.requestId,
        duration: `${duration.toFixed(2)}ms`,
        path: ctx.path
      });
    }
    
    // Alert on high memory usage
    if (memoryUsage > HIGH_MEMORY_THRESHOLD) {
      logger.warn({
        message: 'High memory usage detected',
        requestId: ctx.state.requestId,
        memoryUsage: `${(memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        path: ctx.path
      });
    }
    
    // Alert on high CPU usage
    if (cpuUsage > HIGH_CPU_THRESHOLD) {
      logger.warn({
        message: 'High CPU usage detected',
        requestId: ctx.state.requestId,
        cpuUsage: `${cpuUsage.toFixed(2)}ms`,
        path: ctx.path
      });
    }
  }
};

export default performanceMonitor; 