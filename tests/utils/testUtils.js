import React from "react";
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../src/store/rootReducer';

// Custom render function that includes providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState
    }),
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <Router location={history.location} navigator={history}>
        {children}
      </Router>
    </Provider>
  );
  return {
    ...render(ui, { wrapper: Wrapper }),
    store,
    history
  };
};

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

// Mock matchMedia (keep only this robust implementation)
export const mockMatchMedia = (matches = false) => {
  const mediaQueryList = {
    matches,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      ...mediaQueryList,
      media: query
    }))
  });
  return mediaQueryList;
};

// Mock localStorage (keep only this robust implementation)
export const mockLocalStorage = () => {
  const store = new Map();
  const localStorage = {
    getItem: jest.fn((key) => store.get(key) || null),
    setItem: jest.fn((key, value) => store.set(key, value)),
    removeItem: jest.fn((key) => store.delete(key)),
    clear: jest.fn(() => store.clear()),
    key: jest.fn((index) => Array.from(store.keys())[index]),
    get length() { return store.size; }
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorage,
    writable: true
  });
  return localStorage;
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

// Mock geolocation (keep only this robust implementation)
export const mockGeolocation = (coords = { latitude: 51.5074, longitude: -0.1278 }) => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) => success({ coords })),
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

// Mock Error Boundary component
export class MockErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(_error, _errorInfo) {
    // console.error('Error caught by boundary:', _error, _errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// Mock Suspense component
export const MockSuspense = ({ children, fallback = <div>Loading...</div> }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);
  return isLoading ? fallback : children;
};

// Mock API response
export const mockApiResponse = (data, status = 200, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
        text: () => Promise.resolve(JSON.stringify(data)),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
    }, delay);
  });
};

// Mock API error
export const mockApiError = (error, status = 500) => {
  return Promise.reject({
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
    text: () => Promise.resolve(JSON.stringify({ error })),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
};

// Mock performance marks
export const mockPerformanceMarks = () => {
  const marks = new Map();
  const measures = new Map();
  
  const performance = {
    mark: jest.fn((name) => marks.set(name, performance.now())),
    measure: jest.fn((name, start, end) => {
      const startTime = marks.get(start) || 0;
      const endTime = marks.get(end) || performance.now();
      measures.set(name, endTime - startTime);
    }),
    getEntriesByType: jest.fn((type) => {
      if (type === 'mark') return Array.from(marks.entries()).map(([name, time]) => ({ name, time }));
      if (type === 'measure') return Array.from(measures.entries()).map(([name, duration]) => ({ name, duration }));
      return [];
    }),
    clearMarks: jest.fn(() => marks.clear()),
    clearMeasures: jest.fn(() => measures.clear()),
    now: jest.fn(() => Date.now())
  };
  
  Object.defineProperty(window, 'performance', {
    value: performance,
    writable: true
  });
  
  return performance;
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store = new Map();
  
  const sessionStorage = {
    getItem: jest.fn((key) => store.get(key) || null),
    setItem: jest.fn((key, value) => store.set(key, value)),
    removeItem: jest.fn((key) => store.delete(key)),
    clear: jest.fn(() => store.clear()),
    key: jest.fn((index) => Array.from(store.keys())[index]),
    get length() { return store.size; }
  };
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorage,
    writable: true
  });
  
  return sessionStorage;
};

// Clean up after each test
export const cleanup = () => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  performance.clearMarks();
  performance.clearMeasures();
  performance.getEntriesByType.mockClear();
  performance.getEntriesByName.mockClear();
  performance.getEntries.mockClear();
  performance.now.mockClear();
  // console.error.mockClear();
  // console.warn.mockClear();
  // console.log.mockClear();
  // console.info.mockClear();
  // console.debug.mockClear();
  // console.trace.mockClear();
  // console.group.mockClear();
  // console.groupEnd.mockClear();
  // console.groupCollapsed.mockClear();
  // console.time.mockClear();
  // console.timeEnd.mockClear();
  // console.timeLog.mockClear();
  // console.assert.mockClear();
  global.requestIdleCallback.mockClear();
  global.cancelIdleCallback.mockClear();
  global.requestAnimationFrame.mockClear();
  global.cancelAnimationFrame.mockClear();
};

// Mock WebSocket
export const mockWebSocket = () => {
  const mockWebSocket = jest.fn().mockImplementation(() => ({
    send: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    readyState: 1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
  }));
  global.WebSocket = mockWebSocket;
  return mockWebSocket;
};

// Mock Notification API
export const mockNotification = () => {
  const mockNotification = jest.fn().mockImplementation(() => ({
    close: jest.fn()
  }));
  mockNotification.requestPermission = jest.fn().mockResolvedValue('granted');
  mockNotification.permission = 'granted';
  global.Notification = mockNotification;
  return mockNotification;
};

// Mock Service Worker
export const mockServiceWorker = () => {
  const mockServiceWorker = {
    register: jest.fn().mockResolvedValue({
      unregister: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(undefined)
    })
  };
  global.navigator.serviceWorker = mockServiceWorker;
  return mockServiceWorker;
};

// Mock IndexedDB
export const mockIndexedDB = () => {
  const mockIndexedDB = {
    open: jest.fn().mockImplementation(() => ({
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      result: {
        createObjectStore: jest.fn(),
        transaction: jest.fn().mockImplementation(() => ({
          objectStore: jest.fn().mockImplementation(() => ({
            get: jest.fn().mockImplementation(() => ({
              onsuccess: null,
              onerror: null
            })),
            put: jest.fn().mockImplementation(() => ({
              onsuccess: null,
              onerror: null
            })),
            delete: jest.fn().mockImplementation(() => ({
              onsuccess: null,
              onerror: null
            }))
          }))
        }))
      }
    }))
  };
  global.indexedDB = mockIndexedDB;
  return mockIndexedDB;
};

// Mock BroadcastChannel
export const mockBroadcastChannel = () => {
  const mockBroadcastChannel = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
  global.BroadcastChannel = mockBroadcastChannel;
  return mockBroadcastChannel;
};

// Mock Permissions API
export const mockPermissions = () => {
  const mockPermissions = {
    query: jest.fn().mockResolvedValue({ state: 'granted' })
  };
  global.navigator.permissions = mockPermissions;
  return mockPermissions;
};

// Mock Clipboard API
export const mockClipboard = () => {
  const mockClipboard = {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
    write: jest.fn().mockResolvedValue(undefined),
    read: jest.fn().mockResolvedValue([])
  };
  global.navigator.clipboard = mockClipboard;
  return mockClipboard;
};

// Mock Battery API
export const mockBattery = () => {
  const mockBattery = {
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity,
    level: 1,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
  global.navigator.getBattery = jest.fn().mockResolvedValue(mockBattery);
  return mockBattery;
};

// Mock Network Information API
export const mockNetworkInfo = () => {
  const mockNetworkInfo = {
    type: 'wifi',
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
  global.navigator.connection = mockNetworkInfo;
  return mockNetworkInfo;
};

// Mock Device Memory API
export const mockDeviceMemory = (memory = 8) => {
  Object.defineProperty(global.navigator, 'deviceMemory', {
    value: memory,
    writable: true
  });
};

// Mock Hardware Concurrency API
export const mockHardwareConcurrency = (cores = 8) => {
  Object.defineProperty(global.navigator, 'hardwareConcurrency', {
    value: cores,
    writable: true
  });
};

// Mock Vibration API
export const mockVibration = () => {
  const mockVibrate = jest.fn();
  Object.defineProperty(global.navigator, 'vibrate', {
    value: mockVibrate,
    writable: true
  });
  return mockVibrate;
};

// Mock Screen Orientation API
export const mockScreenOrientation = () => {
  const mockScreenOrientation = {
    type: 'landscape-primary',
    angle: 0,
    lock: jest.fn().mockResolvedValue(undefined),
    unlock: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
  Object.defineProperty(global.screen, 'orientation', {
    value: mockScreenOrientation,
    writable: true
  });
  return mockScreenOrientation;
};

// Mock Fullscreen API
export const mockFullscreen = () => {
  const mockFullscreen = {
    requestFullscreen: jest.fn().mockResolvedValue(undefined),
    exitFullscreen: jest.fn().mockResolvedValue(undefined),
    fullscreenElement: null,
    fullscreenEnabled: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
  Object.defineProperty(global.document, 'fullscreenElement', {
    get: () => mockFullscreen.fullscreenElement,
    configurable: true
  });
  Object.defineProperty(global.document, 'fullscreenEnabled', {
    get: () => mockFullscreen.fullscreenEnabled,
    configurable: true
  });
  Object.defineProperty(global.document, 'requestFullscreen', {
    value: mockFullscreen.requestFullscreen,
    configurable: true
  });
  Object.defineProperty(global.document, 'exitFullscreen', {
    value: mockFullscreen.exitFullscreen,
    configurable: true
  });
  return mockFullscreen;
}; 