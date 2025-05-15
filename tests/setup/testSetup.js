import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { matchers } from '../utils/testMatchers';
import { testHooks } from '../utils/testHooks';
import { createTestData } from '../utils/testDataFactory';
import { assertions } from '../utils/testAssertions';

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  getElementError: (message, container) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    return error;
  }
});

// Extend expect with custom matchers
expect.extend({
  ...matchers.element,
  ...matchers.form,
  ...matchers.api,
  ...matchers.state,
  ...matchers.event,
  ...matchers.performance,
  ...matchers.accessibility,
  ...matchers.snapshot,
  ...matchers.custom
});

// Global test setup
beforeAll(() => {
  // Set up global mocks
  global.fetch = jest.fn();
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };
  global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };
  global.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));
});

// Global test teardown
afterAll(() => {
  // Clean up global mocks
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

// Global test utilities
global.testUtils = {
  // Test data factory
  createTestData,
  // Test hooks
  testHooks,
  // Test assertions
  assertions,
  // Test matchers
  matchers
};

// Global test configuration
global.testConfig = {
  // Test timeouts
  timeouts: {
    default: 5000,
    long: 10000,
    short: 1000
  },
  // Test retries
  retries: {
    default: 3,
    max: 5
  },
  // Test intervals
  intervals: {
    default: 1000,
    short: 100,
    long: 5000
  },
  // Test thresholds
  thresholds: {
    performance: 1000,
    memory: 1000000
  }
};

// Global test environment
global.testEnv = {
  // Test environment variables
  env: {
    NODE_ENV: 'test',
    TEST_MODE: true
  },
  // Test environment setup
  setup: () => {
    // Set up test environment
  },
  // Test environment teardown
  teardown: () => {
    // Clean up test environment
  }
};

// Global test helpers
global.testHelpers = {
  // Test helper functions
  helpers: {
    // Wait for condition
    waitFor: (condition, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
          if (condition()) {
            resolve();
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    },
    // Wait for element
    waitForElement: (selector, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
          const element = document.querySelector(selector);
          if (element) {
            resolve(element);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Timeout waiting for element: ${selector}`));
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    },
    // Wait for elements
    waitForElements: (selector, count, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
          const elements = document.querySelectorAll(selector);
          if (elements.length >= count) {
            resolve(elements);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Timeout waiting for elements: ${selector}`));
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    }
  }
}; 