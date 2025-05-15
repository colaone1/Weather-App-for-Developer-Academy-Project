import logger from './logger.js';

// Error categories
const ERROR_CATEGORIES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE: 'EXTERNAL_SERVICE_ERROR',
  INTERNAL: 'INTERNAL_SERVER_ERROR',
  WEATHER_API: 'WEATHER_API_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR'
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
  504: ERROR_CATEGORIES.TIMEOUT
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2
};

// Circuit breaker configuration
const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  halfOpenTimeout: 5000 // 5 seconds
};

// Circuit breaker state
const circuitBreakers = new Map();

const calculateRetryDelay = (attempt) => {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt),
    RETRY_CONFIG.maxDelay
  );
  return delay;
};

const getCircuitBreaker = (service) => {
  if (!circuitBreakers.has(service)) {
    const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS.default;
    circuitBreakers.set(service, {
      failures: 0,
      lastFailureTime: null,
      state: 'CLOSED',
      config
    });
  }
  return circuitBreakers.get(service);
};

const updateCircuitBreaker = (service, success) => {
  const breaker = getCircuitBreaker(service);
  const now = Date.now();

  if (success) {
    breaker.failures = 0;
    breaker.state = 'CLOSED';
  } else {
    breaker.failures++;
    breaker.lastFailureTime = now;

    if (breaker.failures >= breaker.config.failureThreshold) {
      breaker.state = 'OPEN';
    }
  }
};

const isCircuitBreakerOpen = (service) => {
  const breaker = getCircuitBreaker(service);
  const now = Date.now();

  if (breaker.state === 'OPEN') {
    if (now - breaker.lastFailureTime >= breaker.config.resetTimeout) {
      breaker.state = 'HALF-OPEN';
      return false;
    }
    return true;
  }

  if (breaker.state === 'HALF-OPEN') {
    if (now - breaker.lastFailureTime >= breaker.config.halfOpenTimeout) {
      breaker.state = 'CLOSED';
      return false;
    }
    return true;
  }

  return false;
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