// Circuit breaker configuration and logic extracted from errorHandler.js

const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  halfOpenTimeout: 5000 // 5 seconds
};

const circuitBreakers = new Map();

const calculateRetryDelay = (attempt, RETRY_CONFIG) => {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt),
    RETRY_CONFIG.maxDelay
  );
  return delay;
};

const getCircuitBreaker = (service, SERVICE_CONFIGS) => {
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

const updateCircuitBreaker = (service, success, SERVICE_CONFIGS) => {
  const breaker = getCircuitBreaker(service, SERVICE_CONFIGS);
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

const isCircuitBreakerOpen = (service, SERVICE_CONFIGS) => {
  const breaker = getCircuitBreaker(service, SERVICE_CONFIGS);
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

export {
  CIRCUIT_BREAKER_CONFIG,
  calculateRetryDelay,
  getCircuitBreaker,
  updateCircuitBreaker,
  isCircuitBreakerOpen
}; 