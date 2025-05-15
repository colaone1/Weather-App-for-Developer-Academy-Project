import { TextEncoder, TextDecoder } from 'util';
import { performance } from 'perf_hooks';

// Mock fetch globally with enhanced error handling
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
  })
);

// Mock requestIdleCallback
global.requestIdleCallback = jest.fn().mockImplementation(callback => {
  setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 15 }), 0);
  return 1;
});

global.cancelIdleCallback = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn().mockImplementation(callback => {
  setTimeout(callback, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock localStorage with enhanced functionality
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// Enhanced geolocation mock
const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementation((success, error, options) => {
      if (options && options.timeout) {
        setTimeout(() => {
          success({
            coords: {
              latitude: 60.1695,
              longitude: 24.9355,
              altitude: null,
              accuracy: 10,
              altitudeAccuracy: null,
              heading: null,
              speed: null
            },
            timestamp: Date.now()
          });
        }, options.timeout);
      } else {
        success({
          coords: {
            latitude: 60.1695,
            longitude: 24.9355,
            altitude: null,
            accuracy: 10,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        });
      }
    }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true
});

// Add TextEncoder/TextDecoder for Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Enhanced performance API mock
const performanceMock = {
  ...performance,
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntriesByType: jest.fn().mockReturnValue([]),
  getEntriesByName: jest.fn().mockReturnValue([]),
  getEntries: jest.fn().mockReturnValue([]),
  now: jest.fn().mockReturnValue(0)
};
Object.defineProperty(global, 'performance', {
  value: performanceMock,
  writable: true
});

// Mock console methods with enhanced functionality
const consoleMock = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  group: jest.fn(),
  groupEnd: jest.fn(),
  groupCollapsed: jest.fn(),
  time: jest.fn(),
  timeEnd: jest.fn(),
  timeLog: jest.fn(),
  assert: jest.fn()
};
Object.defineProperty(global, 'console', {
  value: consoleMock,
  writable: true
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
});
Object.defineProperty(window, 'IntersectionObserver', {
  value: mockIntersectionObserver,
  writable: true
});

// Mock ResizeObserver
const mockResizeObserver = jest.fn();
mockResizeObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
});
Object.defineProperty(window, 'ResizeObserver', {
  value: mockResizeObserver,
  writable: true
});

// Mock matchMedia
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
    dispatchEvent: jest.fn()
  }))
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
  performanceMock.clearMarks();
  performanceMock.clearMeasures();
  performanceMock.getEntriesByType.mockClear();
  performanceMock.getEntriesByName.mockClear();
  performanceMock.getEntries.mockClear();
  performanceMock.now.mockClear();
  consoleMock.error.mockClear();
  consoleMock.warn.mockClear();
  consoleMock.log.mockClear();
  consoleMock.info.mockClear();
  consoleMock.debug.mockClear();
  consoleMock.trace.mockClear();
  consoleMock.group.mockClear();
  consoleMock.groupEnd.mockClear();
  consoleMock.groupCollapsed.mockClear();
  consoleMock.time.mockClear();
  consoleMock.timeEnd.mockClear();
  consoleMock.timeLog.mockClear();
  consoleMock.assert.mockClear();
  global.requestIdleCallback.mockClear();
  global.cancelIdleCallback.mockClear();
  global.requestAnimationFrame.mockClear();
  global.cancelAnimationFrame.mockClear();
});

// Set test timeout
jest.setTimeout(10000); 