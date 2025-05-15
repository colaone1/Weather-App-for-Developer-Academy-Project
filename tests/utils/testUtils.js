import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../src/store/rootReducer';

// Custom render function that includes providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({ reducer: rootReducer, preloadedState }),
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          {children}
        </Router>
      </Provider>
    );
  }
  return {
    store,
    history,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
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

// Mock error boundary
export class MockErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// Mock suspense boundary
export function MockSuspense({ children, fallback = <div>Loading...</div> }) {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
}

// Mock API response
export function mockApiResponse(data, status = 200, delay = 0) {
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
}

// Mock API error
export function mockApiError(status = 500, message = 'Internal Server Error') {
  return new Promise((resolve) => {
    resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ message }),
      text: () => Promise.resolve(message),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  });
}

// Mock geolocation
export function mockGeolocation(position = {
  coords: {
    latitude: 60.1695,
    longitude: 24.9355,
    accuracy: 10
  },
  timestamp: Date.now()
}) {
  return {
    getCurrentPosition: jest.fn().mockImplementation((success) => success(position)),
    watchPosition: jest.fn().mockImplementation((success) => {
      success(position);
      return 1;
    }),
    clearWatch: jest.fn()
  };
}

// Mock performance marks
export function mockPerformanceMarks() {
  const marks = new Map();
  const measures = new Map();

  return {
    mark: jest.fn().mockImplementation((name) => {
      marks.set(name, performance.now());
    }),
    measure: jest.fn().mockImplementation((name, startMark, endMark) => {
      const start = marks.get(startMark);
      const end = marks.get(endMark);
      measures.set(name, { start, end, duration: end - start });
    }),
    getEntriesByType: jest.fn().mockImplementation((type) => {
      return type === 'mark' ? Array.from(marks.entries()) : Array.from(measures.entries());
    }),
    clearMarks: jest.fn().mockImplementation(() => marks.clear()),
    clearMeasures: jest.fn().mockImplementation(() => measures.clear())
  };
}

// Mock localStorage
export function mockLocalStorage() {
  const store = new Map();
  return {
    getItem: jest.fn().mockImplementation((key) => store.get(key) || null),
    setItem: jest.fn().mockImplementation((key, value) => store.set(key, value)),
    removeItem: jest.fn().mockImplementation((key) => store.delete(key)),
    clear: jest.fn().mockImplementation(() => store.clear()),
    key: jest.fn().mockImplementation((index) => Array.from(store.keys())[index]),
    get length() { return store.size; }
  };
}

// Mock sessionStorage
export function mockSessionStorage() {
  const store = new Map();
  return {
    getItem: jest.fn().mockImplementation((key) => store.get(key) || null),
    setItem: jest.fn().mockImplementation((key, value) => store.set(key, value)),
    removeItem: jest.fn().mockImplementation((key) => store.delete(key)),
    clear: jest.fn().mockImplementation(() => store.clear()),
    key: jest.fn().mockImplementation((index) => Array.from(store.keys())[index]),
    get length() { return store.size; }
  };
}

// Mock matchMedia
export function mockMatchMedia(matches = false) {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
}

// Clean up after each test
export function cleanup() {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  performance.clearMarks();
  performance.clearMeasures();
  performance.getEntriesByType.mockClear();
  performance.getEntriesByName.mockClear();
  performance.getEntries.mockClear();
  performance.now.mockClear();
  console.error.mockClear();
  console.warn.mockClear();
  console.log.mockClear();
  console.info.mockClear();
  console.debug.mockClear();
  console.trace.mockClear();
  console.group.mockClear();
  console.groupEnd.mockClear();
  console.groupCollapsed.mockClear();
  console.time.mockClear();
  console.timeEnd.mockClear();
  console.timeLog.mockClear();
  console.assert.mockClear();
  global.requestIdleCallback.mockClear();
  global.cancelIdleCallback.mockClear();
  global.requestAnimationFrame.mockClear();
  global.cancelAnimationFrame.mockClear();
}

// Mock WebSocket
export function mockWebSocket() {
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
}

// Mock Notification API
export function mockNotification() {
  const mockNotification = jest.fn().mockImplementation(() => ({
    close: jest.fn()
  }));
  mockNotification.requestPermission = jest.fn().mockResolvedValue('granted');
  mockNotification.permission = 'granted';
  global.Notification = mockNotification;
  return mockNotification;
}

// Mock Service Worker
export function mockServiceWorker() {
  const mockServiceWorker = {
    register: jest.fn().mockResolvedValue({
      unregister: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(undefined)
    })
  };
  global.navigator.serviceWorker = mockServiceWorker;
  return mockServiceWorker;
}

// Mock IndexedDB
export function mockIndexedDB() {
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
}

// Mock BroadcastChannel
export function mockBroadcastChannel() {
  const mockBroadcastChannel = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    close: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }));
  global.BroadcastChannel = mockBroadcastChannel;
  return mockBroadcastChannel;
}

// Mock Permissions API
export function mockPermissions() {
  const mockPermissions = {
    query: jest.fn().mockResolvedValue({ state: 'granted' })
  };
  global.navigator.permissions = mockPermissions;
  return mockPermissions;
}

// Mock Clipboard API
export function mockClipboard() {
  const mockClipboard = {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
    write: jest.fn().mockResolvedValue(undefined),
    read: jest.fn().mockResolvedValue([])
  };
  global.navigator.clipboard = mockClipboard;
  return mockClipboard;
}

// Mock Battery API
export function mockBattery() {
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
}

// Mock Network Information API
export function mockNetworkInfo() {
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
}

// Mock Device Memory API
export function mockDeviceMemory() {
  const mockDeviceMemory = 8;
  Object.defineProperty(global.navigator, 'deviceMemory', {
    value: mockDeviceMemory,
    writable: true
  });
  return mockDeviceMemory;
}

// Mock Hardware Concurrency API
export function mockHardwareConcurrency() {
  const mockHardwareConcurrency = 4;
  Object.defineProperty(global.navigator, 'hardwareConcurrency', {
    value: mockHardwareConcurrency,
    writable: true
  });
  return mockHardwareConcurrency;
}

// Mock Vibration API
export function mockVibration() {
  const mockVibrate = jest.fn();
  Object.defineProperty(global.navigator, 'vibrate', {
    value: mockVibrate,
    writable: true
  });
  return mockVibrate;
}

// Mock Screen Orientation API
export function mockScreenOrientation() {
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
}

// Mock Fullscreen API
export function mockFullscreen() {
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
} 