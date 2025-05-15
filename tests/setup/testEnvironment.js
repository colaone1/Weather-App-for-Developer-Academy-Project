import { TextEncoder, TextDecoder } from 'util';

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
global.requestIdleCallback = jest.fn().mockImplementation(cb => {
  setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 15 }), 0);
  return 1;
});

global.cancelIdleCallback = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn().mockImplementation(cb => {
  setTimeout(cb, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
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
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// Mock performance
const performanceMock = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  getEntries: jest.fn(() => []),
  timeOrigin: Date.now()
};
Object.defineProperty(window, 'performance', {
  value: performanceMock,
  writable: true
});

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation((success) => {
    if (success) {
      success({
        coords: {
          latitude: 51.5074,
          longitude: -0.1276,
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

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
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

// Mock Notification API
global.Notification = jest.fn().mockImplementation(() => ({
  close: jest.fn()
}));
global.Notification.requestPermission = jest.fn().mockResolvedValue('granted');
global.Notification.permission = 'granted';

// Mock Service Worker
global.ServiceWorker = jest.fn();
global.ServiceWorkerRegistration = jest.fn();
global.ServiceWorkerContainer = jest.fn().mockImplementation(() => ({
  register: jest.fn(),
  getRegistration: jest.fn(),
  getRegistrations: jest.fn(),
  startMessages: jest.fn(),
  controller: null,
  ready: Promise.resolve()
}));
Object.defineProperty(global.navigator, 'serviceWorker', {
  value: new global.ServiceWorkerContainer(),
  writable: true
});

// Mock IndexedDB
global.indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
  databases: jest.fn()
};

// Mock BroadcastChannel
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}));

// Mock Permissions API
global.Permissions = jest.fn().mockImplementation(() => ({
  query: jest.fn().mockResolvedValue({ state: 'granted' })
}));
Object.defineProperty(global.navigator, 'permissions', {
  value: new global.Permissions(),
  writable: true
});

// Mock Clipboard API
global.Clipboard = jest.fn();
Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    readText: jest.fn(),
    writeText: jest.fn(),
    read: jest.fn(),
    write: jest.fn()
  },
  writable: true
});

// Mock Battery API
global.BatteryManager = jest.fn().mockImplementation(() => ({
  charging: true,
  chargingTime: Infinity,
  dischargingTime: Infinity,
  level: 1,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}));
Object.defineProperty(global.navigator, 'getBattery', {
  value: jest.fn().mockResolvedValue(new global.BatteryManager()),
  writable: true
});

// Mock Network Information API
Object.defineProperty(global.navigator, 'connection', {
  value: {
    effectiveType: '4g',
    rtt: 50,
    downlink: 10,
    saveData: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  },
  writable: true
});

// Mock Device Memory API
Object.defineProperty(global.navigator, 'deviceMemory', {
  value: 8,
  writable: true
});

// Mock Hardware Concurrency API
Object.defineProperty(global.navigator, 'hardwareConcurrency', {
  value: 8,
  writable: true
});

// Mock Vibration API
Object.defineProperty(global.navigator, 'vibrate', {
  value: jest.fn(),
  writable: true
});

// Mock Screen Orientation API
Object.defineProperty(global.screen, 'orientation', {
  value: {
    type: 'landscape-primary',
    angle: 0,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  },
  writable: true
});

// Mock Fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true
});
Object.defineProperty(document, 'fullscreenEnabled', {
  value: true,
  writable: true
});
Object.defineProperty(document, 'exitFullscreen', {
  value: jest.fn(),
  writable: true
});
Object.defineProperty(document.documentElement, 'requestFullscreen', {
  value: jest.fn(),
  writable: true
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
  
  // Reset all mock implementations
  global.fetch.mockClear();
  global.requestIdleCallback.mockClear();
  global.cancelIdleCallback.mockClear();
  global.requestAnimationFrame.mockClear();
  global.cancelAnimationFrame.mockClear();
  global.IntersectionObserver.mockClear();
  global.ResizeObserver.mockClear();
  global.WebSocket.mockClear();
  global.Notification.mockClear();
  global.ServiceWorker.mockClear();
  global.ServiceWorkerRegistration.mockClear();
  global.ServiceWorkerContainer.mockClear();
  global.indexedDB.open.mockClear();
  global.indexedDB.deleteDatabase.mockClear();
  global.indexedDB.databases.mockClear();
  global.BroadcastChannel.mockClear();
  global.Permissions.mockClear();
  global.Clipboard.mockClear();
  global.BatteryManager.mockClear();
  
  // Reset navigator properties
  Object.defineProperty(global.navigator, 'connection', {
    value: {
      effectiveType: '4g',
      rtt: 50,
      downlink: 10,
      saveData: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    },
    writable: true
  });
  
  // Reset screen orientation
  Object.defineProperty(global.screen, 'orientation', {
    value: {
      type: 'landscape-primary',
      angle: 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    },
    writable: true
  });
  
  // Reset fullscreen state
  Object.defineProperty(document, 'fullscreenElement', {
    value: null,
    writable: true
  });
});

// Set test timeout
jest.setTimeout(10000); 