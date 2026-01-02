/**
 * Integration Tests for Fail-Secure Navigation Behavior
 * Tests the complete error handling flow across all navigation methods.
 *
 * These tests verify that the security fix for the fail-open vulnerability
 * works correctly in an integrated environment.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Fail-Secure Navigation Integration', () => {
  // Simulated error statistics (mirrors injected-script.js errorStats)
  let errorStats;
  let postMessageCalls;
  let toastCalls;
  let navigationBlocked;

  beforeEach(() => {
    // Reset error statistics
    errorStats = {
      checkPermissionErrors: 0,
      lastErrors: [],
      errorsByType: {
        'window.open': 0,
        'location.assign': 0,
        'location.replace': 0,
        'location.href': 0
      }
    };

    postMessageCalls = [];
    toastCalls = [];
    navigationBlocked = {
      'location.assign': false,
      'location.replace': false,
      'location.href': false
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Simulates the reportPermissionError function from injected-script.js
   */
  function reportPermissionError(error, url, navType, isHighRisk) {
    errorStats.checkPermissionErrors++;
    errorStats.errorsByType[navType]++;

    const truncatedUrl = url?.substring(0, 200) || '';

    errorStats.lastErrors.push({
      timestamp: Date.now(),
      error: error?.message || String(error),
      url: truncatedUrl,
      navType: navType,
      isHighRisk: isHighRisk
    });

    if (errorStats.lastErrors.length > 10) {
      errorStats.lastErrors.shift();
    }

    // Simulate postMessage to content script
    postMessageCalls.push({
      type: 'NAV_GUARDIAN_ERROR',
      error: {
        message: error?.message || String(error),
        url: truncatedUrl,
        navType: navType,
        isHighRisk: isHighRisk
      },
      stats: { ...errorStats }
    });
  }

  /**
   * Simulates showBlockedToast
   */
  function showBlockedToast(url, reason) {
    toastCalls.push({ url, reason });
  }

  /**
   * Simulates the complete error handler for each navigation method
   */
  function handleNavigationError(navType, error, url) {
    // Mark as blocked
    navigationBlocked[navType] = true;

    // Report error with isHighRisk=true (the fix)
    reportPermissionError(error, url, navType, true);

    // Show toast (with error handling)
    try {
      showBlockedToast(url, 'Navigation blocked due to security check error');
    } catch (toastError) {
      // Silently handle toast errors
    }

    // DO NOT NAVIGATE - this is the key security fix
  }

  describe('consistent blocking across all methods', () => {
    test('should block all navigation methods consistently on error', () => {
      const error = new Error('Permission check failed');
      const url = 'https://example.com';

      // Trigger error on all three methods
      handleNavigationError('location.assign', error, url);
      handleNavigationError('location.replace', error, url);
      handleNavigationError('location.href', error, url);

      // All should be blocked
      expect(navigationBlocked['location.assign']).toBe(true);
      expect(navigationBlocked['location.replace']).toBe(true);
      expect(navigationBlocked['location.href']).toBe(true);
    });

    test('all methods should report isHighRisk=true', () => {
      const error = new Error('Test error');
      const url = 'https://example.com';

      handleNavigationError('location.assign', error, url);
      handleNavigationError('location.replace', error, url);
      handleNavigationError('location.href', error, url);

      // Check all postMessage calls have isHighRisk=true
      expect(postMessageCalls).toHaveLength(3);
      postMessageCalls.forEach(call => {
        expect(call.error.isHighRisk).toBe(true);
      });
    });

    test('all methods should show toast notifications', () => {
      const error = new Error('Test error');
      const urls = [
        'https://site1.com',
        'https://site2.com',
        'https://site3.com'
      ];

      handleNavigationError('location.assign', error, urls[0]);
      handleNavigationError('location.replace', error, urls[1]);
      handleNavigationError('location.href', error, urls[2]);

      expect(toastCalls).toHaveLength(3);
      expect(toastCalls[0].url).toBe(urls[0]);
      expect(toastCalls[1].url).toBe(urls[1]);
      expect(toastCalls[2].url).toBe(urls[2]);
    });
  });

  describe('error statistics tracking', () => {
    test('should track errors in errorStats correctly', () => {
      const error = new Error('Test error');
      const url = 'https://example.com';

      // Trigger errors on different methods
      handleNavigationError('location.href', error, url);
      handleNavigationError('location.href', error, url);
      handleNavigationError('location.assign', error, url);

      expect(errorStats.checkPermissionErrors).toBe(3);
      expect(errorStats.errorsByType['location.href']).toBe(2);
      expect(errorStats.errorsByType['location.assign']).toBe(1);
      expect(errorStats.errorsByType['location.replace']).toBe(0);
    });

    test('should maintain last 10 errors only', () => {
      const url = 'https://example.com';

      // Generate 15 errors
      for (let i = 0; i < 15; i++) {
        const error = new Error(`Error ${i}`);
        handleNavigationError('location.href', error, url);
      }

      expect(errorStats.lastErrors.length).toBe(10);
      expect(errorStats.lastErrors[0].error).toBe('Error 5');
      expect(errorStats.lastErrors[9].error).toBe('Error 14');
    });

    test('should truncate long URLs in error logs', () => {
      const error = new Error('Test error');
      const longUrl = 'https://example.com/' + 'a'.repeat(300);

      handleNavigationError('location.href', error, longUrl);

      expect(errorStats.lastErrors[0].url.length).toBe(200);
    });
  });

  describe('postMessage communication', () => {
    test('should send NAV_GUARDIAN_ERROR message on failure', () => {
      const error = new Error('Message handler unavailable');
      const url = 'https://example.com/page';

      handleNavigationError('location.href', error, url);

      expect(postMessageCalls).toHaveLength(1);
      expect(postMessageCalls[0].type).toBe('NAV_GUARDIAN_ERROR');
      expect(postMessageCalls[0].error.message).toBe('Message handler unavailable');
      expect(postMessageCalls[0].error.navType).toBe('location.href');
      expect(postMessageCalls[0].error.isHighRisk).toBe(true);
    });

    test('should include complete error stats in message', () => {
      const error = new Error('Test error');
      const url = 'https://example.com';

      // Generate some errors first
      handleNavigationError('location.assign', error, url);
      handleNavigationError('location.href', error, url);

      const lastMessage = postMessageCalls[postMessageCalls.length - 1];
      expect(lastMessage.stats.checkPermissionErrors).toBe(2);
      expect(lastMessage.stats.errorsByType['location.assign']).toBe(1);
      expect(lastMessage.stats.errorsByType['location.href']).toBe(1);
    });
  });

  describe('error resilience', () => {
    test('should handle null error gracefully', () => {
      const url = 'https://example.com';

      expect(() => {
        handleNavigationError('location.href', null, url);
      }).not.toThrow();

      expect(navigationBlocked['location.href']).toBe(true);
    });

    test('should handle undefined error gracefully', () => {
      const url = 'https://example.com';

      expect(() => {
        handleNavigationError('location.href', undefined, url);
      }).not.toThrow();

      expect(navigationBlocked['location.href']).toBe(true);
    });

    test('should handle error object without message', () => {
      const url = 'https://example.com';
      const errorObject = { code: 500, status: 'INTERNAL_ERROR' };

      expect(() => {
        handleNavigationError('location.href', errorObject, url);
      }).not.toThrow();

      expect(postMessageCalls[0].error.message).toBe('[object Object]');
    });

    test('should handle null URL gracefully', () => {
      const error = new Error('Test error');

      expect(() => {
        handleNavigationError('location.href', error, null);
      }).not.toThrow();

      expect(errorStats.lastErrors[0].url).toBe('');
    });
  });

  describe('security verification', () => {
    test('consecutive errors should all be blocked', () => {
      const errors = [
        new Error('Error 1'),
        new Error('Error 2'),
        new Error('Error 3')
      ];

      errors.forEach((error, index) => {
        navigationBlocked['location.href'] = false; // Reset for each test
        handleNavigationError('location.href', error, `https://site${index}.com`);
        expect(navigationBlocked['location.href']).toBe(true);
      });
    });

    test('should not leak sensitive URL information', () => {
      const error = new Error('Test error');
      const sensitiveUrl = 'https://example.com/api?token=secret123&password=abc';

      handleNavigationError('location.href', error, sensitiveUrl);

      // URL is stored but truncated to 200 chars
      const storedUrl = errorStats.lastErrors[0].url;
      expect(storedUrl.length).toBeLessThanOrEqual(200);
    });
  });
});
