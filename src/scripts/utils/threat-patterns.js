/**
 * Shared Threat Patterns for OriginalUI Extension
 *
 * This file contains threat patterns shared across multiple security modules.
 * Consolidates ad networks, tracking parameters, and common malicious patterns
 * to ensure consistency and reduce maintenance burden.
 *
 * @fileoverview Centralized threat pattern definitions
 * @module ThreatPatterns
 * @since 1.0.0
 */

/**
 * Known malicious ad networks and pop-under domains
 * Used for both URL validation and code analysis
 *
 * @type {string[]}
 * @constant
 */
export const AD_NETWORK_DOMAINS = [
  "pubfuture-ad.com",
  "clickadu.com",
  "propellerads.com",
  "popcash.com", // Note: popcash uses .com (original pattern compatibility)
  "popcash.net", // Also include .net variant
  "adexchangeclear.com",
];

/**
 * Suspicious tracking URL parameters
 * Common in ad networks and malicious redirects
 *
 * @type {string[]}
 * @constant
 */
export const TRACKING_PARAMETERS = [
  "param_4",
  "param_5",
  "clickid",
  "adclick",
  "redirect",
];

/**
 * Special URLs with security implications
 *
 * @type {string[]}
 * @constant
 */
export const SPECIAL_URLS = ["about:blank"];

/**
 * Compiled regex patterns for URL analysis
 * Pre-compiled for performance optimization
 *
 * @type {Object}
 * @constant
 */
export const URL_THREAT_PATTERNS = {
  /**
   * PHP tracking parameters (param_4, param_5)
   * Pattern: .php?param_4=xxx or .php?param_5=xxx
   *
   * @type {RegExp}
   */
  phpTracking: /\.php\?.*param_[45]/i,

  /**
   * Ad network domain matcher
   * Matches any known ad network domain
   *
   * @type {RegExp}
   */
  adNetworks: new RegExp(
    `(?:${AD_NETWORK_DOMAINS.map((d) => d.replace(/\./g, "\\.")).join("|")})`,
    "i"
  ),

  /**
   * Pop-under indicator keyword in URL
   *
   * @type {RegExp}
   */
  popUnderKeyword: /popunder/i,
};

/**
 * Threat scoring for shared patterns
 * Provides consistent risk assessment across modules
 *
 * @type {Object}
 * @constant
 */
export const THREAT_SCORES = {
  // Ad network domains
  adexchangeclear: 8, // Known malicious
  genericAdNetwork: 5, // Other ad networks

  // Tracking parameters
  trackingParam: 3, // param_4, param_5, clickid, etc.

  // PHP tracking
  phpTracking: 6, // .php?param_4=xxx pattern

  // Special URLs
  aboutBlank: 5, // about:blank redirect
  popUnderKeyword: 4, // "popunder" in URL
};

/**
 * Get risk score for a specific ad network domain
 *
 * @param {string} domain - Domain to check
 * @returns {number} Risk score (0 if not found)
 *
 * @example
 * getAdNetworkScore('https://adexchangeclear.com/ad'); // Returns 8
 * getAdNetworkScore('https://clickadu.com/ad'); // Returns 5
 * getAdNetworkScore('https://google.com'); // Returns 0
 */
export function getAdNetworkScore(domain) {
  if (domain.includes("adexchangeclear.com")) {
    return THREAT_SCORES.adexchangeclear;
  }
  if (AD_NETWORK_DOMAINS.some((d) => domain.includes(d))) {
    return THREAT_SCORES.genericAdNetwork;
  }
  return 0;
}

/**
 * Check if URL contains tracking parameters
 *
 * @param {URL} urlObj - Parsed URL object
 * @returns {string[]} Array of found tracking parameters
 *
 * @example
 * const url = new URL('https://example.com?param_4=123&param_5=456');
 * findTrackingParams(url); // Returns ['param_4', 'param_5']
 */
export function findTrackingParams(urlObj) {
  const found = [];
  TRACKING_PARAMETERS.forEach((param) => {
    if (urlObj.searchParams.has(param)) {
      found.push(param);
    }
  });
  return found;
}
