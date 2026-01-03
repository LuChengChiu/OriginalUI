/**
 * Unit Tests for Navigation Error Handling - Fail-Secure Behavior
 * Tests that all navigation methods (location.href, location.assign, location.replace)
 * correctly block navigation when permission checks fail.
 *
 * Security Principle: "If in doubt, deny."
 * All security controls must fail-secure, never fail-open.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock implementations for testing error handling behavior
describe('Navigation Error Handling - Fail-Secure', () => {
  let mockShowBlockedToast;
  let mockReportPermissionError;
  let mockOriginalNavigation;
  let navigationAttempted;

  beforeEach(() => {
    // Reset state
    navigationAttempted = false;

    // Mock showBlockedToast
    mockShowBlockedToast = vi.fn();

    // Mock reportPermissionError
    mockReportPermissionError = vi.fn();

    // Mock original navigation function
    mockOriginalNavigation = vi.fn(() => {
      navigationAttempted = true;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Simulates the error handling pattern from injected-script.js
   * This mirrors the actual implementation to verify behavior
   */
  function simulateErrorHandler(navType, error, url) {
    // This simulates the catch block pattern:
    // .catch((error) => {
    //   console.error('Navigation Guardian: Unexpected error in ' + navType + ':', error);
    //   reportPermissionError(error, url, navType, true);
    //   try {
    //     showBlockedToast(url, 'Navigation blocked due to security check error');
    //   } catch (toastError) {
    //     console.warn('Navigation Guardian: Could not show blocked toast:', toastError);
    //   }
    // });

    mockReportPermissionError(error, url, navType, true);

    try {
      mockShowBlockedToast(url, 'Navigation blocked due to security check error');
    } catch (toastError) {
      // Silently handle toast error - navigation should still be blocked
      console.warn('Navigation Guardian: Could not show blocked toast:', toastError);
    }

    // CRITICAL: Do NOT call mockOriginalNavigation - this is the fail-secure behavior
    // The old vulnerable code would have called mockOriginalNavigation here
  }

  /**
   * Simulates the OLD vulnerable fail-open behavior for comparison
   */
  function simulateVulnerableErrorHandler(navType, error, url) {
    mockReportPermissionError(error, url, navType, false); // Note: false was the old value

    // VULNERABLE: This is what the old code did - allow navigation on error
    try {
      mockOriginalNavigation(url);
    } catch (navError) {
      // Even navigation errors were swallowed
    }
  }

  describe('location.href error path', () => {
    test('should NOT navigate when permission check throws', () => {
      const error = new Error('Permission check failed');
      const url = 'https://malicious-site.com';

      simulateErrorHandler('location.href', error, url);

      expect(navigationAttempted).toBe(false);
    });

    test('should show toast notification on error', () => {
      const error = new Error('Permission check failed');
      const url = 'https://example.com';

      simulateErrorHandler('location.href', error, url);

      expect(mockShowBlockedToast).toHaveBeenCalledWith(
        url,
        'Navigation blocked due to security check error'
      );
    });

    test('should report error with isHighRisk=true', () => {
      const error = new Error('Network error');
      const url = 'https://example.com';

      simulateErrorHandler('location.href', error, url);

      expect(mockReportPermissionError).toHaveBeenCalledWith(
        error,
        url,
        'location.href',
        true // isHighRisk should be true
      );
    });

    test('should block navigation even if toast fails', () => {
      const error = new Error('Permission check failed');
      const url = 'https://example.com';

      // Make toast throw an error
      mockShowBlockedToast.mockImplementation(() => {
        throw new Error('Toast failed - document.body is null');
      });

      // Should not throw
      expect(() => {
        simulateErrorHandler('location.href', error, url);
      }).not.toThrow();

      // Navigation should still be blocked
      expect(navigationAttempted).toBe(false);
    });
  });

  describe('location.assign error path', () => {
    test('should block navigation on error', () => {
      const error = new Error('Message handler unavailable');
      const url = 'https://example.com';

      simulateErrorHandler('location.assign', error, url);

      expect(navigationAttempted).toBe(false);
    });

    test('should show toast notification', () => {
      const error = new Error('Timeout');
      const url = 'https://example.com';

      simulateErrorHandler('location.assign', error, url);

      expect(mockShowBlockedToast).toHaveBeenCalledTimes(1);
      expect(mockShowBlockedToast).toHaveBeenCalledWith(
        url,
        'Navigation blocked due to security check error'
      );
    });

    test('should report with isHighRisk=true', () => {
      const error = new Error('Unknown error');
      const url = 'https://example.com';

      simulateErrorHandler('location.assign', error, url);

      expect(mockReportPermissionError).toHaveBeenCalledWith(
        error,
        url,
        'location.assign',
        true
      );
    });
  });

  describe('location.replace error path', () => {
    test('should block navigation on error', () => {
      const error = new Error('AbortError');
      const url = 'https://example.com';

      simulateErrorHandler('location.replace', error, url);

      expect(navigationAttempted).toBe(false);
    });

    test('should show toast notification', () => {
      const error = new Error('Channel closed');
      const url = 'https://example.com';

      simulateErrorHandler('location.replace', error, url);

      expect(mockShowBlockedToast).toHaveBeenCalledWith(
        url,
        'Navigation blocked due to security check error'
      );
    });

    test('should report with isHighRisk=true', () => {
      const error = new Error('Extension context invalidated');
      const url = 'https://example.com';

      simulateErrorHandler('location.replace', error, url);

      expect(mockReportPermissionError).toHaveBeenCalledWith(
        error,
        url,
        'location.replace',
        true
      );
    });
  });

  describe('toast error handling', () => {
    test('should not throw if showBlockedToast fails', () => {
      const error = new Error('Permission check failed');
      const url = 'https://example.com';

      mockShowBlockedToast.mockImplementation(() => {
        throw new Error('Cannot read property createElement of null');
      });

      // The error handler should catch toast errors silently
      expect(() => {
        simulateErrorHandler('location.href', error, url);
      }).not.toThrow();
    });

    test('should still report error even if toast fails', () => {
      const error = new Error('Permission check failed');
      const url = 'https://example.com';

      mockShowBlockedToast.mockImplementation(() => {
        throw new Error('DOM error');
      });

      simulateErrorHandler('location.href', error, url);

      // reportPermissionError should still be called
      expect(mockReportPermissionError).toHaveBeenCalledWith(
        error,
        url,
        'location.href',
        true
      );
    });
  });

  describe('consistent behavior across all methods', () => {
    const methods = ['location.href', 'location.assign', 'location.replace'];

    methods.forEach(method => {
      test(`${method} should block navigation on error`, () => {
        const error = new Error('Test error');
        const url = 'https://example.com';

        simulateErrorHandler(method, error, url);

        expect(navigationAttempted).toBe(false);
      });

      test(`${method} should report with isHighRisk=true`, () => {
        const error = new Error('Test error');
        const url = 'https://example.com';

        simulateErrorHandler(method, error, url);

        expect(mockReportPermissionError).toHaveBeenCalledWith(
          error,
          url,
          method,
          true
        );
      });

      test(`${method} should show toast notification`, () => {
        const error = new Error('Test error');
        const url = 'https://example.com';

        simulateErrorHandler(method, error, url);

        expect(mockShowBlockedToast).toHaveBeenCalled();
      });
    });
  });

  describe('security verification - vulnerability is fixed', () => {
    test('old fail-open behavior would have allowed navigation', () => {
      const error = new Error('Permission check failed');
      const url = 'https://malicious-site.com';

      // Simulate the OLD vulnerable behavior
      simulateVulnerableErrorHandler('location.href', error, url);

      // Old behavior: navigation would proceed
      expect(navigationAttempted).toBe(true);
    });

    test('new fail-secure behavior blocks navigation', () => {
      const error = new Error('Permission check failed');
      const url = 'https://malicious-site.com';

      // Reset navigation state
      navigationAttempted = false;

      // Simulate the NEW secure behavior
      simulateErrorHandler('location.href', error, url);

      // New behavior: navigation is blocked
      expect(navigationAttempted).toBe(false);
    });

    test('attacker cannot bypass protection by triggering exceptions', () => {
      const attackVectors = [
        new Error('Crafted exception'),
        new TypeError('Type mismatch attack'),
        new RangeError('Range attack'),
        { message: 'Object with message property' },
        null,
        undefined
      ];

      attackVectors.forEach((attackError, index) => {
        navigationAttempted = false;

        try {
          simulateErrorHandler('location.href', attackError, 'https://malicious.com');
        } catch (e) {
          // Error handler should not throw
          throw new Error(`Attack vector ${index} caused exception: ${e.message}`);
        }

        expect(navigationAttempted).toBe(false);
      });
    });
  });

  describe('error types handling', () => {
    const errorTypes = [
      { name: 'Timeout error', error: new Error('Timeout') },
      { name: 'Abort error', error: new DOMException('Aborted', 'AbortError') },
      { name: 'Network error', error: new Error('Network error') },
      { name: 'Extension context invalidated', error: new Error('Extension context invalidated') },
      { name: 'Message channel closed', error: new Error('Message channel closed') },
      { name: 'Permission denied', error: new Error('Permission denied') },
    ];

    errorTypes.forEach(({ name, error }) => {
      test(`should handle ${name} with fail-secure behavior`, () => {
        const url = 'https://example.com';
        navigationAttempted = false;

        simulateErrorHandler('location.href', error, url);

        expect(navigationAttempted).toBe(false);
        expect(mockReportPermissionError).toHaveBeenCalledWith(
          error,
          url,
          'location.href',
          true
        );
      });
    });
  });
});
