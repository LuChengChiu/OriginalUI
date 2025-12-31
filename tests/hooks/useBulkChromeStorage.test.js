import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBulkChromeStorage } from '@/hooks/useBulkChromeStorage';

describe('useBulkChromeStorage', () => {
  beforeEach(() => {
    // Mock Chrome storage API
    global.chrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn()
        },
        onChanged: {
          addListener: vi.fn(),
          removeListener: vi.fn()
        }
      },
      runtime: {
        lastError: null
      }
    };
  });

  it('should load multiple values from storage', async () => {
    const schema = {
      whitelist: [],
      customRules: [],
      defaultRulesEnabled: true
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        whitelist: ['example.com', 'google.com'],
        customRules: [{ id: '1', name: 'Rule 1' }],
        defaultRulesEnabled: false
      });
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have loaded values
    expect(result.current.values).toEqual({
      whitelist: ['example.com', 'google.com'],
      customRules: [{ id: '1', name: 'Rule 1' }],
      defaultRulesEnabled: false
    });
    expect(result.current.error).toBe(null);
  });

  it('should use default values for missing keys', async () => {
    const schema = {
      whitelist: [],
      customRules: [],
      defaultRulesEnabled: true
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      // Only provide some values
      callback({
        whitelist: ['example.com']
        // customRules, defaultRulesEnabled missing
      });
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use defaults for missing keys
    expect(result.current.values).toEqual({
      whitelist: ['example.com'],
      customRules: [],
      defaultRulesEnabled: true
    });
  });

  it('should update specific key in storage', async () => {
    const schema = {
      whitelist: [],
      customRules: []
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        whitelist: [],
        customRules: []
      });
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Update whitelist
    act(() => {
      result.current.updateValue('whitelist', ['example.com', 'google.com']);
    });

    // Should immediately update local state
    expect(result.current.values.whitelist).toEqual(['example.com', 'google.com']);

    // Should call chrome.storage.local.set
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { whitelist: ['example.com', 'google.com'] },
      expect.any(Function)
    );
  });

  it('should sync changes from other components for multiple keys', async () => {
    let storageListener;

    const schema = {
      whitelist: [],
      defaultRulesEnabled: true
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        whitelist: [],
        defaultRulesEnabled: true
      });
    });

    chrome.storage.onChanged.addListener.mockImplementation((listener) => {
      storageListener = listener;
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate storage changes from another component/tab
    act(() => {
      storageListener(
        {
          whitelist: { newValue: ['example.com'] },
          defaultRulesEnabled: { newValue: false }
        },
        'local'
      );
    });

    // Should sync both values
    expect(result.current.values.whitelist).toEqual(['example.com']);
    expect(result.current.values.defaultRulesEnabled).toBe(false);
  });

  it('should only sync registered keys', async () => {
    let storageListener;

    const schema = {
      whitelist: [],
      customRules: []
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        whitelist: [],
        customRules: []
      });
    });

    chrome.storage.onChanged.addListener.mockImplementation((listener) => {
      storageListener = listener;
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialValues = { ...result.current.values };

    // Simulate storage change for unregistered key
    act(() => {
      storageListener(
        {
          someOtherKey: { newValue: 'some value' }
        },
        'local'
      );
    });

    // Should not add unregistered key to values
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.values.someOtherKey).toBeUndefined();
  });

  it('should ignore changes from non-local storage', async () => {
    let storageListener;

    const schema = {
      whitelist: []
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ whitelist: [] });
    });

    chrome.storage.onChanged.addListener.mockImplementation((listener) => {
      storageListener = listener;
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialValues = { ...result.current.values };

    // Simulate storage change from sync storage (not local)
    act(() => {
      storageListener(
        { whitelist: { newValue: ['example.com'] } },
        'sync' // Different namespace
      );
    });

    // Should not update values
    expect(result.current.values).toEqual(initialValues);
  });

  it('should handle chrome.runtime.lastError', async () => {
    const mockError = { message: 'Storage error' };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      chrome.runtime.lastError = mockError;
      callback({});
    });

    const { result } = renderHook(() => useBulkChromeStorage({ key1: 'default' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should set error
    expect(result.current.error).toBe(mockError);
  });

  it('should cleanup listener on unmount', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ whitelist: [] });
    });

    const { unmount } = renderHook(() => useBulkChromeStorage({ whitelist: [] }));

    await waitFor(() => {
      expect(chrome.storage.onChanged.addListener).toHaveBeenCalled();
    });

    unmount();

    // Should remove listener
    expect(chrome.storage.onChanged.removeListener).toHaveBeenCalled();
  });

  it('should handle complex nested objects', async () => {
    const schema = {
      navigationStats: { blockedCount: 0, allowedCount: 0 },
      config: { enabled: true, settings: { threshold: 10 } }
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({
        navigationStats: { blockedCount: 5, allowedCount: 10 },
        config: { enabled: false, settings: { threshold: 20 } }
      });
    });

    const { result } = renderHook(() => useBulkChromeStorage(schema));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.values.navigationStats).toEqual({
      blockedCount: 5,
      allowedCount: 10
    });

    expect(result.current.values.config).toEqual({
      enabled: false,
      settings: { threshold: 20 }
    });

    // Update nested object
    act(() => {
      result.current.updateValue('navigationStats', {
        blockedCount: 15,
        allowedCount: 20
      });
    });

    expect(result.current.values.navigationStats).toEqual({
      blockedCount: 15,
      allowedCount: 20
    });
  });

  it('should batch load all keys in a single call', async () => {
    const schema = {
      key1: 'default1',
      key2: 'default2',
      key3: 'default3'
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ key1: 'value1', key2: 'value2', key3: 'value3' });
    });

    renderHook(() => useBulkChromeStorage(schema));

    // Should call chrome.storage.local.get once with all keys
    expect(chrome.storage.local.get).toHaveBeenCalledTimes(1);
    expect(chrome.storage.local.get).toHaveBeenCalledWith(
      ['key1', 'key2', 'key3'],
      expect.any(Function)
    );
  });
});
