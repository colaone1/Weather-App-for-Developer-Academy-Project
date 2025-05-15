import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { mockIntersectionObserver, mockResizeObserver, mockMatchMedia } from '../utils/testUtils';

// Configure testing-library with stricter settings
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  getElementError: (message, container) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    return error;
  },
});

// Set up global mocks
beforeAll(() => {
  mockIntersectionObserver();
  mockResizeObserver();
  mockMatchMedia();
  
  // Suppress console errors during tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Set test timeout
jest.setTimeout(10000);

// Mock window.matchMedia with more realistic implementation
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo with more detailed implementation
window.scrollTo = jest.fn((x, y) => {
  window.scrollX = x;
  window.scrollY = y;
});

// Mock window.alert with more detailed implementation
window.alert = jest.fn((message) => {
  console.log(`[Alert] ${message}`);
});

// Mock window.confirm with more detailed implementation
window.confirm = jest.fn((message) => {
  console.log(`[Confirm] ${message}`);
  return true;
});

// Mock window.prompt with more detailed implementation
window.prompt = jest.fn((message, defaultValue) => {
  console.log(`[Prompt] ${message}`);
  return defaultValue || '';
});

// Mock window.requestAnimationFrame with more accurate timing
window.requestAnimationFrame = (callback) => {
  return setTimeout(() => {
    const timestamp = performance.now();
    callback(timestamp);
  }, 0);
};

// Mock window.cancelAnimationFrame
window.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock window.getComputedStyle with more realistic implementation
window.getComputedStyle = jest.fn().mockImplementation((element) => ({
  getPropertyValue: (prop) => {
    const style = element.style;
    return style[prop] || '';
  },
  setProperty: (prop, value) => {
    const style = element.style;
    style[prop] = value;
  },
}));

// Mock window.ResizeObserver with more detailed implementation
window.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn((target) => {
    callback([{ target, contentRect: { width: 0, height: 0 } }]);
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.IntersectionObserver with more detailed implementation
window.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn((target) => {
    callback([{ target, isIntersecting: false, intersectionRatio: 0 }]);
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Patch window.performance to ensure all required methods are always available
if (!window.performance) window.performance = {};
window.performance.now = jest.fn(() => Date.now());
window.performance.mark = window.performance.mark || jest.fn();
window.performance.measure = window.performance.measure || jest.fn();
window.performance.clearMarks = window.performance.clearMarks || jest.fn();
window.performance.clearMeasures = window.performance.clearMeasures || jest.fn();
window.performance.getEntriesByType = window.performance.getEntriesByType || jest.fn(() => []);
window.performance.getEntriesByName = window.performance.getEntriesByName || jest.fn(() => []);
window.performance.getEntries = window.performance.getEntries || jest.fn(() => []);
window.performance.toJSON = window.performance.toJSON || jest.fn(() => ({ navigation: {}, timing: {}, memory: {} }));

// Mock window.navigator with more detailed implementation
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'node.js',
    geolocation: {
      getCurrentPosition: jest.fn((success, error) => {
        success({ coords: { latitude: 0, longitude: 0 } });
      }),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
    language: 'en-US',
    languages: ['en-US', 'en'],
    platform: 'node',
    vendor: 'node',
    onLine: true,
    cookieEnabled: true,
    doNotTrack: null,
    maxTouchPoints: 0,
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

global.requestIdleCallback = jest.fn();
global.cancelIdleCallback = jest.fn();
global.requestAnimationFrame = jest.fn();
global.cancelAnimationFrame = jest.fn(); 