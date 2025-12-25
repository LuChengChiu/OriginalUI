/**
 * ModalManager Module - UI modal handling for NavigationGuardian
 * 
 * @fileoverview Provides comprehensive modal UI creation and management including XSS-safe element
 * creation, user interaction handling, keyboard shortcuts, and proper cleanup lifecycle management.
 * This module handles all user interface aspects of navigation confirmation modals.
 * 
 * @example
 * // Basic modal usage
 * const modalManager = new ModalManager();
 * const userChoice = await modalManager.showConfirmationModal({
 *   url: 'https://example.com',
 *   threatDetails: { riskScore: 5, threats: [...] }
 * });
 * 
 * @example
 * // Safe element creation
 * const button = modalManager.createSafeElement('button', {
 *   textContent: 'Click me',
 *   style: 'background: blue; color: white;'
 * });
 * 
 * @module ModalManager
 * @extends CleanableModule
 * @since 1.0.0
 * @author JustUI Team
 */

import { MAX_Z_INDEX } from '../../constants.js';
import { LIFECYCLE_PHASES, CleanableModule } from '../ICleanable.js';

/**
 * ModalManager class providing modal UI creation and lifecycle management
 * @extends CleanableModule
 * @class
 */
export class ModalManager extends CleanableModule {
  /**
   * Create a ModalManager instance
   * @constructor
   */
  constructor() {
    super();
    
    /**
     * Currently active modal element (for preventing duplicates)
     * @type {HTMLElement|null}
     * @private
     */
    this.activeModal = null;
    
    /**
     * Modal animation style element
     * @type {HTMLElement|null}
     * @private
     */
    this.modalStyleElement = null;
    
    /**
     * Statistics callback for tracking user decisions
     * @type {Function|null}
     * @private
     */
    this.statisticsCallback = null;
    
    /**
     * URL security validator callback
     * @type {Function|null}
     * @private
     */
    this.urlValidator = null;
    
    console.log('JustUI: ModalManager initialized');
  }

  /**
   * Set the statistics callback for tracking user decisions
   * @param {Function} callback - Function to call with (allowed: boolean) when user makes decision
   */
  setStatisticsCallback(callback) {
    this.statisticsCallback = callback;
  }

  /**
   * Set the URL validator callback for security validation
   * @param {Function} validator - Function to call with (url: string) for validation
   */
  setURLValidator(validator) {
    this.urlValidator = validator;
  }

  /**
   * Safely create a DOM element with text content (prevents XSS)
   * @param {string} tagName - Element tag name
   * @param {object} options - Element configuration
   * @param {string} [options.textContent] - Safe text content (auto-escaped)
   * @param {string} [options.style] - CSS styles via cssText
   * @param {Object} [options.attributes] - Element attributes to set
   * @param {HTMLElement[]} [options.children] - Child elements to append
   * @returns {HTMLElement} Created DOM element
   */
  createSafeElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    // Set text content safely (auto-escapes HTML)
    if (options.textContent) {
      element.textContent = options.textContent;
    }

    // Set styles via cssText (safe)
    if (options.style) {
      element.style.cssText = options.style;
    }

    // Set attributes
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    // Append children
    if (options.children) {
      options.children.forEach(child => {
        if (child) element.appendChild(child);
      });
    }

    return element;
  }

  /**
   * Show navigation confirmation modal with threat details
   * @param {Object} config - Modal configuration
   * @param {string} config.url - The target URL to display
   * @param {Object} [config.threatDetails] - Optional threat analysis details
   * @param {number} [config.threatDetails.riskScore] - Risk score (0-20+)
   * @param {Array} [config.threatDetails.threats] - Array of detected threats
   * @param {boolean} [config.threatDetails.isPopUnder] - True if pop-under detected
   * @returns {Promise<boolean>} Promise that resolves with user decision (true=allow, false=block)
   */
  showConfirmationModal(config) {
    const { url: targetURL, threatDetails = null } = config;
    
    return new Promise((resolve) => {
      // Prevent multiple modals for the same URL
      if (this.activeModal) {
        console.warn('JustUI: Navigation modal already exists, ignoring duplicate');
        resolve(false); // Default to deny for safety
        return;
      }

      // Create modal overlay
      const overlay = this.createModalOverlay();
      this.activeModal = overlay;

      // Create modal card
      const modal = this.createModalCard();

      // Add modal animation styles
      this.addModalAnimationStyles();

      // Validate URL for security before display (with error handling)
      let validatedURL = targetURL; // Default fallback
      if (this.urlValidator) {
        try {
          validatedURL = this.urlValidator(targetURL);
        } catch (validatorError) {
          console.error('JustUI: Error in URL validator callback:', validatorError);
          // Use original URL as fallback - validation errors shouldn't break modal display
          validatedURL = targetURL;
        }
      }

      // Determine threat level and message
      const isPopUnder = threatDetails?.isPopUnder || false;
      const riskScore = threatDetails?.riskScore || 0;
      const threats = threatDetails?.threats || [];
      
      const threatLevel = this.getThreatLevel(riskScore);
      
      // Build modal content
      const modalContent = this.buildModalContent({
        validatedURL,
        isPopUnder,
        threatLevel,
        threats,
        threatDetails
      });

      // Clear modal and append safe content
      modal.innerHTML = ''; // Clear existing content
      modalContent.forEach(element => modal.appendChild(element));
      overlay.appendChild(modal);

      // Setup event handlers
      this.setupModalEventHandlers({
        overlay,
        targetURL,
        resolve,
        isPopUnder
      });

      // Add modal to page and focus
      document.body.appendChild(overlay);
      
      console.log('JustUI: Navigation Guardian modal displayed for:', targetURL);
    });
  }

  /**
   * Create modal overlay element
   * @returns {HTMLElement} Modal overlay element
   * @private
   */
  createModalOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'justui-navigation-modal';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: ${MAX_Z_INDEX};
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    return overlay;
  }

  /**
   * Create modal card element
   * @returns {HTMLElement} Modal card element
   * @private
   */
  createModalCard() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      animation: justui-modal-appear 0.2s ease-out;
    `;
    return modal;
  }

  /**
   * Add modal animation styles to document head
   * @private
   */
  addModalAnimationStyles() {
    if (this.modalStyleElement) {
      return; // Styles already added
    }

    this.modalStyleElement = document.createElement('style');
    this.modalStyleElement.textContent = `
      @keyframes justui-modal-appear {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    document.head.appendChild(this.modalStyleElement);
  }

  /**
   * Get threat level information based on risk score
   * @param {number} riskScore - Risk score from threat analysis
   * @returns {Object} Threat level information
   * @private
   */
  getThreatLevel(riskScore) {
    if (riskScore >= 8) {
      return { level: 'HIGH', color: '#dc2626' };
    } else if (riskScore >= 4) {
      return { level: 'MEDIUM', color: '#d97706' };
    } else {
      return { level: 'LOW', color: '#059669' };
    }
  }

  /**
   * Build modal content elements
   * @param {Object} config - Modal content configuration
   * @returns {HTMLElement[]} Array of modal content elements
   * @private
   */
  buildModalContent(config) {
    const { validatedURL, isPopUnder, threatLevel, threats, threatDetails } = config;
    
    // Build header section
    const headerDiv = this.buildHeaderSection(isPopUnder);
    
    // Build threat details section (if threats exist)
    const threatDetailsDiv = this.buildThreatDetailsSection({
      threatDetails,
      threats,
      threatLevel,
      isPopUnder
    });
    
    // Build URL display section
    const urlDiv = this.buildURLSection(validatedURL);
    
    // Build button section
    const buttonContainer = this.buildButtonSection(isPopUnder);
    
    // Assemble modal content
    const modalContent = [headerDiv];
    if (threatDetailsDiv) {
      modalContent.push(threatDetailsDiv);
    }
    modalContent.push(urlDiv, buttonContainer);
    
    return modalContent;
  }

  /**
   * Build header section with title and description
   * @param {boolean} isPopUnder - Whether this is a pop-under attempt
   * @returns {HTMLElement} Header section element
   * @private
   */
  buildHeaderSection(isPopUnder) {
    const modalHeader = this.createSafeElement('h3', {
      textContent: '🛡️ Navigation Guardian',
      style: 'margin: 0 0 12px 0; font-size: 18px; color: #1f2937;'
    });

    const modalDescription = this.createSafeElement('p', {
      textContent: isPopUnder
        ? 'Blocked a pop-under advertisement attempting to open:'
        : 'This page is trying to navigate to an external site:',
      style: 'margin: 0; color: #6b7280; line-height: 1.5;'
    });

    return this.createSafeElement('div', {
      style: 'margin-bottom: 16px;',
      children: [modalHeader, modalDescription]
    });
  }

  /**
   * Build threat details section if threats exist
   * @param {Object} config - Threat details configuration
   * @returns {HTMLElement|null} Threat details element or null
   * @private
   */
  buildThreatDetailsSection(config) {
    const { threatDetails, threats, threatLevel, isPopUnder } = config;
    
    if (!threatDetails || threats.length === 0) {
      return null;
    }
    
    const topThreats = threats.slice(0, 3);

    // Create threat list items safely
    const threatListItems = topThreats.map(threat =>
      this.createSafeElement('li', {
        textContent: `${threat.type} (Risk: ${threat.score})`,
        style: 'margin-bottom: 2px;'
      })
    );

    const threatList = this.createSafeElement('ul', {
      style: 'margin: 4px 0 0 16px; padding: 0;',
      children: threatListItems
    });

    const threatTitle = this.createSafeElement('strong', {
      textContent: 'Detected threats:'
    });

    const threatContent = this.createSafeElement('div', {
      style: 'font-size: 13px; color: #7f1d1d;',
      children: [threatTitle, threatList]
    });

    const threatLevelSpan = this.createSafeElement('span', {
      textContent: `⚠️ Threat Level: ${threatLevel.level}`,
      style: `color: ${threatLevel.color}; font-weight: 600; font-size: 14px;`
    });

    const threatHeader = this.createSafeElement('div', {
      style: 'display: flex; align-items: center; margin-bottom: 8px;',
      children: [threatLevelSpan]
    });

    // Add pop-under badge if applicable
    if (isPopUnder) {
      const popUnderBadge = this.createSafeElement('span', {
        textContent: 'POP-UNDER',
        style: 'margin-left: 8px; background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;'
      });
      threatHeader.appendChild(popUnderBadge);
    }

    // Assemble complete threat details
    return this.createSafeElement('div', {
      style: 'background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-bottom: 16px;',
      children: [threatHeader, threatContent]
    });
  }

  /**
   * Build URL display section
   * @param {string} validatedURL - URL validated for security display
   * @returns {HTMLElement} URL display element
   * @private
   */
  buildURLSection(validatedURL) {
    return this.createSafeElement('div', {
      textContent: validatedURL,
      style: 'background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-family: monospace; font-size: 14px; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;'
    });
  }

  /**
   * Build button section with Block and Allow buttons
   * @param {boolean} isPopUnder - Whether this is a pop-under attempt
   * @returns {HTMLElement} Button container element
   * @private
   */
  buildButtonSection(isPopUnder) {
    const denyButton = this.createSafeElement('button', {
      textContent: isPopUnder ? 'Block Ad' : 'Block',
      style: 'background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;',
      attributes: { id: 'justui-nav-deny' }
    });

    const allowButton = this.createSafeElement('button', {
      textContent: 'Allow',
      style: 'background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;',
      attributes: { id: 'justui-nav-allow' }
    });

    return this.createSafeElement('div', {
      style: 'display: flex; gap: 12px; justify-content: flex-end;',
      children: [denyButton, allowButton]
    });
  }

  /**
   * Setup modal event handlers for user interaction
   * @param {Object} config - Event handler configuration
   * @private
   */
  setupModalEventHandlers(config) {
    const { overlay, targetURL, resolve, isPopUnder } = config;
    
    // Track if the modal has been responded to
    let hasResponded = false;

    // Handle responses
    const cleanup = () => {
      this.cleanupModal();
    };

    const handleAllow = () => {
      if (hasResponded) return;
      hasResponded = true;
      
      console.log('JustUI: Navigation Guardian - User allowed navigation to:', targetURL);
      cleanup();
      
      // Update statistics if callback provided (with error handling)
      if (this.statisticsCallback) {
        try {
          this.statisticsCallback(true);
        } catch (callbackError) {
          console.error('JustUI: Error in statistics callback (allow):', callbackError);
          // Continue execution - callback errors shouldn't break modal functionality
        }
      }
      
      resolve(true);
    };

    const handleDeny = () => {
      if (hasResponded) return;
      hasResponded = true;
      
      console.log('JustUI: Navigation Guardian - User blocked navigation to:', targetURL);
      cleanup();
      
      // Update statistics if callback provided (with error handling)
      if (this.statisticsCallback) {
        try {
          this.statisticsCallback(false);
        } catch (callbackError) {
          console.error('JustUI: Error in statistics callback (deny):', callbackError);
          // Continue execution - callback errors shouldn't break modal functionality
        }
      }
      
      resolve(false);
    };

    // Find buttons and attach event listeners
    const denyButton = overlay.querySelector('#justui-nav-deny');
    const allowButton = overlay.querySelector('#justui-nav-allow');

    if (denyButton) {
      denyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDeny();
      }, { once: true });
    }

    if (allowButton) {
      allowButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAllow();
      }, { once: true });
    }

    // Keyboard support
    const keydownHandler = (e) => {
      if (hasResponded) return;
      
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleDeny();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleAllow();
      }
    };
    
    overlay.addEventListener('keydown', keydownHandler);

    // Focus deny button by default (safer choice)
    setTimeout(() => {
      if (!hasResponded && denyButton) {
        denyButton.focus();
      }
    }, 100);
  }

  /**
   * Clean up active modal and associated resources
   * @private
   */
  cleanupModal() {
    if (this.activeModal && this.activeModal.parentNode) {
      this.activeModal.parentNode.removeChild(this.activeModal);
    }
    this.activeModal = null;
  }

  /**
   * Legacy method for backward compatibility with NavigationGuardian
   * @param {string} targetURL - The target URL
   * @param {Function} callback - Callback function with user decision
   * @param {Object} threatDetails - Optional threat analysis details
   * @deprecated Use showConfirmationModal() instead
   */
  showNavigationModal(targetURL, callback, threatDetails = null) {
    this.showConfirmationModal({ url: targetURL, threatDetails })
      .then(allowed => {
        try {
          callback(allowed);
        } catch (callbackError) {
          console.error('JustUI: Error in legacy callback:', callbackError);
          // Callback error handling - error already logged, no further action needed
        }
      })
      .catch(error => {
        console.error('JustUI: Modal error:', error);
        try {
          callback(false); // Default to deny for safety
        } catch (callbackError) {
          console.error('JustUI: Error in legacy callback (fallback):', callbackError);
        }
      });
  }

  /**
   * Enhanced cleanup with comprehensive resource management
   */
  cleanup() {
    console.log('JustUI: Starting ModalManager cleanup...');
    
    this.setLifecyclePhase(LIFECYCLE_PHASES.CLEANUP_PENDING);
    
    try {
      // Clean up active modal
      this.cleanupModal();
      
      // Remove modal styles
      if (this.modalStyleElement && this.modalStyleElement.parentNode) {
        this.modalStyleElement.parentNode.removeChild(this.modalStyleElement);
        this.modalStyleElement = null;
      }
      
      // Clear callbacks
      this.statisticsCallback = null;
      this.urlValidator = null;
      
      // Call parent cleanup
      super.cleanup();
      
      console.log('JustUI: ModalManager cleanup completed');
      
    } catch (error) {
      console.error('JustUI: Error during ModalManager cleanup:', error);
      this.setLifecyclePhase(LIFECYCLE_PHASES.ERROR);
      throw error;
    }
  }
}