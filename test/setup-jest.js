/**
 * Jest Test Setup
 * Basic setup for testing Chrome extension modules with Jest
 */

// Mock Chrome Extension APIs
global.chrome = {
  runtime: {
    id: 'test-extension-id',
    lastError: null,
    getURL: jest.fn((path) => `chrome-extension://test-extension-id/${path}`)
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  scripting: {
    executeScript: jest.fn()
  }
};

// Mock Performance API
global.performance = {
  now: () => Date.now(),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000
  }
};