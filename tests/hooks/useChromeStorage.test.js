import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChromeStorage } from '@/hooks/useChromeStorage';

describe('useChromeStorage', () => {
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

  it('should load initial value from storage', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ myKey: 'stored value' });
    });

    const { result } = renderHook(() => useChromeStorage('myKey', 'default'));

    // Wait for storage to load
    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    // Should have loaded value and loading=false
    expect(result.current[0]).toBe('stored value');
    expect(result.current[3]).toBe(null); // no error
  });

  it('should use default value when key does not exist', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({}); // Empty result
    });

    const { result } = renderHook(() => useChromeStorage('myKey', 'default'));

    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    expect(result.current[0]).toBe('default');
  });

  it('should save value to storage when updateValue is called', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ myKey: 'initial' });
    });

    const { result } = renderHook(() => useChromeStorage('myKey', 'default'));

    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    // Get the updateValue function
    const updateValue = result.current[1];

    // Update value
    act(() => {
      updateValue('new value');
    });

    // Should immediately update local state
    expect(result.current[0]).toBe('new value');

    // Should call chrome.storage.local.set
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      { myKey: 'new value' },
      expect.any(Function)
    );
  });

  it('should sync changes from other components', async () => {
    let storageListener;

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ myKey: 'initial' });
    });

    chrome.storage.onChanged.addListener.mockImplementation((listener) => {
      storageListener = listener;
    });

    const { result } = renderHook(() => useChromeStorage('myKey', 'default'));

    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    expect(result.current[0]).toBe('initial');

    // Simulate storage change from another component/tab
    act(() => {
      storageListener(
        { myKey: { newValue: 'updated from elsewhere' } },
        'local'
      );
    });

    // Should sync the new value
    expect(result.current[0]).toBe('updated from elsewhere');
  });

  it('should handle chrome.runtime.lastError', async () => {
    const mockError = { message: 'Storage error' };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      chrome.runtime.lastError = mockError;
      callback({});
    });

    const { result } = renderHook(() => useChromeStorage('myKey', 'default'));

    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    // Should set error
    expect(result.current[3]).toBe(mockError);
  });

  it('should cleanup listener on unmount', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ myKey: 'value' });
    });

    const { unmount } = renderHook(() => useChromeStorage('myKey', 'default'));

    await waitFor(() => {
      expect(chrome.storage.onChanged.addListener).toHaveBeenCalled();
    });

    unmount();

    // Should remove listener
    expect(chrome.storage.onChanged.removeListener).toHaveBeenCalled();
  });

  it('should handle array values correctly', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ myArray: ['a', 'b', 'c'] });
    });

    const { result } = renderHook(() => useChromeStorage('myArray', []));

    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);

    // Update with new array
    act(() => {
      result.current[1](['d', 'e', 'f']);
    });

    expect(result.current[0]).toEqual(['d', 'e', 'f']);
  });

  it('should handle object values correctly', async () => {
    const initialObj = { count: 10, enabled: true };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ myObject: initialObj });
    });

    const { result } = renderHook(() => useChromeStorage('myObject', {}));

    await waitFor(() => {
      expect(result.current[2]).toBe(false);
    });

    expect(result.current[0]).toEqual(initialObj);

    // Update with new object
    const newObj = { count: 20, enabled: false };

    act(() => {
      result.current[1](newObj);
    });

    expect(result.current[0]).toEqual(newObj);
  });
});
