import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

// Custom render function that includes providers
export function renderWithProviders(
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Router location={history.location} navigator={history}>{children}</Router>;
  }
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    history,
  };
}

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
};

// Mock matchMedia
export const mockMatchMedia = () => {
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
};

// Mock localStorage
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

// Mock fetch with error handling
export const mockFetch = (response, options = {}) => {
  const { error = false, status = 200, delay = 0 } = options;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (error) {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      } else {
        global.fetch = jest.fn().mockResolvedValue({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(response),
        });
      }
      resolve();
    }, delay);
  });
};

// Mock console methods
export const mockConsole = () => {
  const originalConsole = { ...console };
  const mockConsole = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
  global.console = mockConsole;
  return { originalConsole, mockConsole };
};

// Wait utility
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock geolocation
export const mockGeolocation = (coords = { latitude: 51.5074, longitude: -0.1278 }) => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementation((success) => success({ coords })),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  };
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });
  return mockGeolocation;
};

// Mock performance
export const mockPerformance = () => {
  const performance = {
    now: jest.fn().mockReturnValue(0),
    mark: jest.fn(),
    measure: jest.fn(),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
  };
  Object.defineProperty(global, 'performance', {
    value: performance,
    writable: true,
  });
  return performance;
}; 