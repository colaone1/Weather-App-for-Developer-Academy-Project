import logger from './logger.js';
import {
  CIRCUIT_BREAKER_CONFIG,
  calculateRetryDelay,
  getCircuitBreaker,
  updateCircuitBreaker,
  isCircuitBreakerOpen
} from './circuitBreaker.js';
import { ERROR_CATEGORIES, STATUS_TO_CATEGORY } from './errorCategories.js';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2
};

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || 'Internal Server Error',
    };
    ctx.app.emit('error', err, ctx);
  }
};

// Service-specific circuit breaker configurations
const SERVICE_CONFIGS = {
  weather: {
    failureThreshold: 3,
    resetTimeout: 15000,
    halfOpenTimeout: 3000
  },
  forecast: {
    failureThreshold: 4,
    resetTimeout: 20000,
    halfOpenTimeout: 4000
  },
  default: CIRCUIT_BREAKER_CONFIG
};

export default errorHandler;
export {
  ERROR_CATEGORIES,
  STATUS_TO_CATEGORY,
  RETRY_CONFIG,
  SERVICE_CONFIGS,
  calculateRetryDelay,
  getCircuitBreaker,
  updateCircuitBreaker,
  isCircuitBreakerOpen
}; 