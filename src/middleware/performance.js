import logger from './logger.js';
import { performance } from 'perf_hooks';
import { v4 as uuidv4 } from 'uuid';

const SLOW_REQUEST_THRESHOLD = 1000; // 1 second
const HIGH_MEMORY_THRESHOLD = 50 * 1024 * 1024; // 50MB
const HIGH_CPU_THRESHOLD = 70; // 70%
const METRICS_CLEANUP_INTERVAL = 3600000; // 1 hour

// Performance metrics storage
const metrics = new Map();

// Periodic cleanup of old metrics
setInterval(() => {
  const now = Date.now();
  for (const [traceId, metric] of metrics.entries()) {
    if (now - metric.startTime > METRICS_CLEANUP_INTERVAL) {
      metrics.delete(traceId);
    }
  }
}, METRICS_CLEANUP_INTERVAL);

const performanceMonitor = async (ctx, next) => {
  const traceId = uuidv4();
  const start = performance.now();
  const startMemory = process.memoryUsage();
  const startCpu = process.cpuUsage();
  
  // Initialize metrics for this request
  metrics.set(traceId, {
    startTime: start,
    startMemory,
    startCpu,
    marks: [],
    measures: []
  });
  
  // Add trace ID to response headers
  ctx.set('X-Trace-ID', traceId);
  
  try {
    // Mark the start of the request
    performance.mark(`request-start-${traceId}`);
    
    await next();
    
    // Mark the end of the request
    performance.mark(`request-end-${traceId}`);
    performance.measure(
      `request-duration-${traceId}`,
      `request-start-${traceId}`,
      `request-end-${traceId}`
    );
    
    const end = performance.now();
    const endMemory = process.memoryUsage();
    const endCpu = process.cpuUsage(startCpu);
    
    const duration = end - start;
    const memoryUsage = endMemory.heapUsed - startMemory.heapUsed;
    const cpuUsage = (endCpu.user + endCpu.system) / 1000; // Convert to milliseconds
    
    // Calculate memory usage percentage
    const memoryUsagePercent = (endMemory.heapUsed / endMemory.heapTotal) * 100;
    
    // Get performance measures
    const measures = performance.getEntriesByType('measure')
      .filter(measure => measure.name.includes(traceId));
    
    // Enhanced performance metrics
    const performanceMetrics = {
      requestId: ctx.state.requestId,
      traceId,
      method: ctx.method,
      path: ctx.path,
      duration: `${duration.toFixed(2)}ms`,
      memoryUsage: `${(memoryUsage / 1024 / 1024).toFixed(2)}MB`,
      memoryUsagePercent: `${memoryUsagePercent.toFixed(2)}%`,
      cpuUsage: `${cpuUsage.toFixed(2)}ms`,
      status: ctx.status,
      measures: measures.map(measure => ({
        name: measure.name.replace(`-${traceId}`, ''),
        duration: `${measure.duration.toFixed(2)}ms`
      })),
      memoryDetails: {
        heapTotal: `${(endMemory.heapTotal / 1024 / 1024).toFixed(2)}MB`,
        heapUsed: `${(endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        external: `${(endMemory.external / 1024 / 1024).toFixed(2)}MB`,
        rss: `${(endMemory.rss / 1024 / 1024).toFixed(2)}MB`
      }
    };
    
    // Log performance metrics
    logger.info({
      message: 'Request performance metrics',
      ...performanceMetrics
    });
    
    // Set performance headers
    ctx.set('X-Response-Time', `${duration.toFixed(2)}ms`);
    ctx.set('X-Memory-Usage', `${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    ctx.set('X-CPU-Usage', `${cpuUsage.toFixed(2)}ms`);
    ctx.set('X-Memory-Percent', `${memoryUsagePercent.toFixed(2)}%`);
    
    // Alert on slow requests
    if (duration > SLOW_REQUEST_THRESHOLD) {
      logger.warn({
        message: 'Slow request detected',
        ...performanceMetrics
      });
    }
    
    // Alert on high memory usage
    if (memoryUsage > HIGH_MEMORY_THRESHOLD) {
      logger.warn({
        message: 'High memory usage detected',
        ...performanceMetrics
      });
    }
    
    // Alert on high CPU usage
    if (cpuUsage > HIGH_CPU_THRESHOLD) {
      logger.warn({
        message: 'High CPU usage detected',
        ...performanceMetrics
      });
    }
    
    // Clean up performance marks and measures
    performance.clearMarks(`request-start-${traceId}`);
    performance.clearMarks(`request-end-${traceId}`);
    performance.clearMeasures(`request-duration-${traceId}`);
    
    // Remove metrics from storage
    metrics.delete(traceId);
  } catch (error) {
    logger.error('Performance monitoring error:', {
      error,
      traceId,
      requestId: ctx.state.requestId
    });
    await next();
  }
};

export default performanceMonitor; 