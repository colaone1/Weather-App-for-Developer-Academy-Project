import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { mockIntersectionObserver, mockResizeObserver, mockMatchMedia } from '../utils/testUtils';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Set up global mocks
beforeAll(() => {
  mockIntersectionObserver();
  mockResizeObserver();
  mockMatchMedia();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Set test timeout
jest.setTimeout(10000);

// Mock window.matchMedia
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

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock window.alert
window.alert = jest.fn();

// Mock window.confirm
window.confirm = jest.fn();

// Mock window.prompt
window.prompt = jest.fn();

// Mock window.requestAnimationFrame
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Mock window.cancelAnimationFrame
window.cancelAnimationFrame = jest.fn();

// Mock window.getComputedStyle
window.getComputedStyle = jest.fn().mockReturnValue({
  getPropertyValue: jest.fn(),
});

// Mock window.ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.IntersectionObserver
window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.performance
window.performance = {
  now: jest.fn(),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

// Mock window.navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'node.js',
    geolocation: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
  },
  writable: true,
}); 