/**
 * Shared constants for JustUI Chrome Extension
 */

// Maximum z-index value (2^31 - 1) - used for overlay detection and modal positioning
export const MAX_Z_INDEX = 2147483647;

// High z-index threshold for suspicious element detection
export const HIGH_Z_INDEX_THRESHOLD = 1000000;

// Very high z-index threshold for click hijacking detection  
export const VERY_HIGH_Z_INDEX_THRESHOLD = 2000000;