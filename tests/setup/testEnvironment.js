import { TextEncoder, TextDecoder } from 'util';
import { performance } from 'perf_hooks';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementationOnce((success) => success({
      coords: {
        latitude: 60.1695,
        longitude: 24.9355
      }
    }))
};
global.navigator.geolocation = mockGeolocation;

// Add TextEncoder/TextDecoder for Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add performance API
global.performance = performance;

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

// Set test timeout
jest.setTimeout(10000);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}; 