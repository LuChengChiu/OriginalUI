/**
 * Vitest Test Setup
 * Global setup for testing Chrome extension modules
 */

import { beforeEach, afterEach, vi } from 'vitest'

// Mock Chrome Extension APIs
global.chrome = {
  runtime: {
    id: 'test-extension-id',
    lastError: null,
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn(),
      hasListeners: vi.fn()
    },
    onInstalled: {
      addListener: vi.fn()
    },
    onSuspend: {
      addListener: vi.fn()
    },
    sendMessage: vi.fn(),
    getURL: vi.fn((path) => `chrome-extension://test-extension-id/${path}`)
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      getBytesInUse: vi.fn()
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      getBytesInUse: vi.fn()
    },
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
    onUpdated: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
  },
  scripting: {
    executeScript: vi.fn(),
    insertCSS: vi.fn(),
    removeCSS: vi.fn()
  },
  alarms: {
    create: vi.fn(),
    clear: vi.fn(),
    onAlarm: {
      addListener: vi.fn()
    }
  },
  declarativeNetRequest: {
    updateDynamicRules: vi.fn(),
    getDynamicRules: vi.fn()
  },
  webNavigation: {
    onBeforeNavigate: {
      addListener: vi.fn()
    },
    onCommitted: {
      addListener: vi.fn()
    }
  }
}\n\n// Mock Performance API if not available\nif (typeof performance === 'undefined') {\n  global.performance = {\n    now: () => Date.now(),\n    mark: vi.fn(),\n    measure: vi.fn(),\n    getEntriesByType: vi.fn(() => []),\n    memory: {\n      usedJSHeapSize: 1000000,\n      totalJSHeapSize: 2000000,\n      jsHeapSizeLimit: 4000000\n    }\n  }\n}\n\n// Mock requestIdleCallback if not available\nif (typeof requestIdleCallback === 'undefined') {\n  global.requestIdleCallback = vi.fn((callback) => {\n    const deadline = {\n      timeRemaining: () => 50,\n      didTimeout: false\n    }\n    return setTimeout(() => callback(deadline), 0)\n  })\n  global.cancelIdleCallback = vi.fn(clearTimeout)\n}\n\n// Mock DOM APIs for tests that need them\nif (typeof document !== 'undefined') {\n  // Mock createElement with proper event listener support\n  const originalCreateElement = document.createElement.bind(document)\n  document.createElement = vi.fn((tagName) => {\n    const element = originalCreateElement(tagName)\n    \n    // Add event listener tracking for testing\n    element._eventListeners = new Map()\n    const originalAddEventListener = element.addEventListener.bind(element)\n    const originalRemoveEventListener = element.removeEventListener.bind(element)\n    \n    element.addEventListener = vi.fn((type, listener, options) => {\n      if (!element._eventListeners.has(type)) {\n        element._eventListeners.set(type, [])\n      }\n      element._eventListeners.get(type).push({ listener, options })\n      return originalAddEventListener(type, listener, options)\n    })\n    \n    element.removeEventListener = vi.fn((type, listener, options) => {\n      if (element._eventListeners.has(type)) {\n        const listeners = element._eventListeners.get(type)\n        const index = listeners.findIndex(l => l.listener === listener)\n        if (index > -1) {\n          listeners.splice(index, 1)\n        }\n      }\n      return originalRemoveEventListener(type, listener, options)\n    })\n    \n    return element\n  })\n}\n\n// Mock console methods for testing (optional - remove if you want actual console output)\nconst originalConsole = { ...console }\nglobal.console = {\n  ...originalConsole,\n  log: vi.fn(originalConsole.log),\n  warn: vi.fn(originalConsole.warn),\n  error: vi.fn(originalConsole.error),\n  debug: vi.fn(originalConsole.debug),\n  info: vi.fn(originalConsole.info)\n}\n\n// Test utilities for Chrome extension testing\nglobal.testUtils = {\n  /**\n   * Mock successful Chrome storage operations\n   */\n  mockChromeStorageSuccess: (data = {}) => {\n    chrome.storage.local.get.mockImplementation((keys, callback) => {\n      const result = typeof keys === 'string' ? \n        { [keys]: data[keys] } : \n        Array.isArray(keys) ? \n          keys.reduce((acc, key) => ({ ...acc, [key]: data[key] }), {}) :\n          data\n      \n      if (callback) {\n        callback(result)\n      }\n      return Promise.resolve(result)\n    })\n    \n    chrome.storage.local.set.mockImplementation((items, callback) => {\n      Object.assign(data, items)\n      if (callback) {\n        callback()\n      }\n      return Promise.resolve()\n    })\n  },\n  \n  /**\n   * Mock Chrome storage errors\n   */\n  mockChromeStorageError: (error = new Error('Storage error')) => {\n    chrome.runtime.lastError = error\n    chrome.storage.local.get.mockImplementation((keys, callback) => {\n      if (callback) {\n        callback(null)\n      }\n      return Promise.reject(error)\n    })\n    chrome.storage.local.set.mockImplementation((items, callback) => {\n      if (callback) {\n        callback()\n      }\n      return Promise.reject(error)\n    })\n  },\n  \n  /**\n   * Reset Chrome API mocks\n   */\n  resetChromeMocks: () => {\n    Object.values(chrome.storage.local).forEach(mock => {\n      if (typeof mock.mockReset === 'function') {\n        mock.mockReset()\n      }\n    })\n    chrome.runtime.lastError = null\n  },\n  \n  /**\n   * Create a mock DOM element with event tracking\n   */\n  createMockElement: (tagName = 'div') => {\n    const element = document.createElement(tagName)\n    element.isConnected = true\n    element.remove = vi.fn(() => {\n      element.isConnected = false\n    })\n    return element\n  },\n  \n  /**\n   * Wait for next tick (useful for testing async operations)\n   */\n  nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),\n  \n  /**\n   * Wait for a specific condition to be true\n   */\n  waitFor: async (condition, timeout = 5000) => {\n    const start = Date.now()\n    while (Date.now() - start < timeout) {\n      if (await condition()) {\n        return true\n      }\n      await new Promise(resolve => setTimeout(resolve, 10))\n    }\n    throw new Error('Condition not met within timeout')\n  }\n}\n\n// Setup and teardown hooks\nbeforeEach(() => {\n  // Reset mocks before each test\n  vi.clearAllMocks()\n  testUtils.resetChromeMocks()\n  \n  // Reset performance tracking\n  if (performance.clearMarks) {\n    performance.clearMarks()\n  }\n  if (performance.clearMeasures) {\n    performance.clearMeasures()\n  }\n})\n\nafterEach(() => {\n  // Clean up any timers\n  vi.clearAllTimers()\n  \n  // Reset DOM if needed\n  if (typeof document !== 'undefined') {\n    document.head.innerHTML = ''\n    document.body.innerHTML = ''\n  }\n})\n\n// Global error handler for unhandled promise rejections in tests\nprocess.on('unhandledRejection', (reason) => {\n  console.error('Unhandled promise rejection in test:', reason)\n})"