const NodeEnvironment = require('jest-environment-node');
const { TextEncoder, TextDecoder } = require('util');

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
  }

  async setup() {
    await super.setup();
    
    // Add custom globals
    this.global.performance = {
      now: () => Date.now(),
      mark: jest.fn(),
      measure: jest.fn(),
      clearMarks: jest.fn(),
      clearMeasures: jest.fn(),
      getEntriesByType: jest.fn(() => []),
      getEntriesByName: jest.fn(() => []),
      getEntries: jest.fn(() => [])
    };

    // Mock IntersectionObserver
    this.global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock ResizeObserver
    this.global.ResizeObserver = class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock matchMedia
    this.global.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock window methods
    this.global.window = {
      ...this.global.window,
      scrollTo: jest.fn(),
      alert: jest.fn(),
      confirm: jest.fn(),
      prompt: jest.fn(),
      requestAnimationFrame: callback => setTimeout(callback, 0),
      cancelAnimationFrame: jest.fn(),
      getComputedStyle: jest.fn(() => ({
        getPropertyValue: jest.fn(),
        setProperty: jest.fn()
      }))
    };

    // Mock navigator
    this.global.navigator = {
      ...this.global.navigator,
      geolocation: {
        getCurrentPosition: jest.fn((success) => 
          success({ coords: { latitude: 0, longitude: 0 } })
        ),
        watchPosition: jest.fn(),
        clearWatch: jest.fn()
      },
      userAgent: 'node.js',
      language: 'en-US',
      languages: ['en-US', 'en'],
      platform: 'node',
      vendor: 'node',
      onLine: true,
      cookieEnabled: true,
      doNotTrack: null,
      maxTouchPoints: 0
    };

    // Mock storage
    const storageMock = () => {
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
        })
      };
    };

    this.global.localStorage = storageMock();
    this.global.sessionStorage = storageMock();

    // Mock fetch
    this.global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        headers: new Headers(),
        status: 200,
        statusText: 'OK'
      })
    );

    // Mock WebSocket
    this.global.WebSocket = class WebSocket {
      constructor() {
        setTimeout(() => this.onopen(), 0);
      }
      send() {}
      close() {}
      addEventListener() {}
      removeEventListener() {}
      dispatchEvent() {}
    };

    // Mock Notification
    this.global.Notification = {
      permission: 'default',
      requestPermission: jest.fn().mockResolvedValue('granted')
    };

    // Mock Service Worker
    this.global.navigator.serviceWorker = {
      register: jest.fn().mockResolvedValue({
        unregister: jest.fn().mockResolvedValue(true),
        update: jest.fn().mockResolvedValue(undefined)
      })
    };

    // Mock IndexedDB
    this.global.indexedDB = {
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
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomEnvironment; 