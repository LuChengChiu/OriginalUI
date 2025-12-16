// Content script for JustUI Chrome Extension
// Handles DOM element removal based on rules and whitelist

let isActive = false;
let whitelist = [];
let defaultRules = [];
let customRules = [];
let defaultRulesEnabled = true;
let customRulesEnabled = true;
let currentDomain = "";
let domainStats = {}; // Per-domain statistics
let patternRulesEnabled = true; // New pattern-based detection
let adDetectionEngine = null;

// Get current domain
function getCurrentDomain() {
  try {
    return new URL(window.location.href).hostname;
  } catch (error) {
    return "";
  }
}

// Helper function to match domain with potential subdomain pattern
function domainMatches(domain, pattern) {
  // If pattern has wildcard prefix (*.example.com)
  if (pattern.startsWith("*.")) {
    const baseDomain = pattern.slice(2);
    return domain === baseDomain || domain.endsWith("." + baseDomain);
  }

  // Exact match
  if (domain === pattern) return true;

  // Also match subdomains for patterns without wildcard
  // e.g., if "youtube.com" is whitelisted, "www.youtube.com" should also match
  if (domain.endsWith("." + pattern)) return true;

  return false;
}

// Check if current domain is whitelisted (with caching)
let cachedWhitelistResult = null;
let cachedWhitelistDomain = null;

function isDomainWhitelisted(domain) {
  // Return cached result if domain and whitelist haven't changed
  if (cachedWhitelistDomain === domain && cachedWhitelistResult !== null) {
    return cachedWhitelistResult;
  }

  cachedWhitelistDomain = domain;
  cachedWhitelistResult = whitelist.some((whitelistedDomain) =>
    domainMatches(domain, whitelistedDomain)
  );

  return cachedWhitelistResult;
}

// Invalidate cache when whitelist changes
function invalidateWhitelistCache() {
  cachedWhitelistResult = null;
  cachedWhitelistDomain = null;
}

// Check if rule applies to current domain
function ruleAppliesTo(rule, domain) {
  if (!rule.domains || rule.domains.length === 0) return false;

  // Check for wildcard
  if (rule.domains.includes("*")) return true;

  // Check for exact match or subdomain match
  return rule.domains.some((ruleDomain) => domainMatches(domain, ruleDomain));
}

// Advanced pattern-based element detection
async function executePatternRules() {
  if (!adDetectionEngine || !patternRulesEnabled) return 0;

  let patternRemovedCount = 0;

  try {
    // Get all potentially suspicious elements
    const suspiciousElements = document.querySelectorAll(
      "div, iframe, section, aside, nav, header"
    );

    for (const element of suspiciousElements) {
      // Skip if already processed
      if (element.hasAttribute("data-justui-removed")) continue;

      // Run pattern analysis
      const analysis = await adDetectionEngine.analyze(element);

      if (analysis.isAd && analysis.confidence > 0.7) {
        // Mark element with detection details
        element.setAttribute(
          "data-justui-removed",
          `pattern-${analysis.totalScore}`
        );
        element.setAttribute(
          "data-justui-confidence",
          Math.round(analysis.confidence * 100)
        );
        element.setAttribute(
          "data-justui-rules",
          analysis.matchedRules.map((r) => r.rule).join(",")
        );

        // Hide the element
        element.style.display = "none";
        patternRemovedCount++;

        console.log(
          `JustUI: Pattern detection removed element (score: ${
            analysis.totalScore
          }, confidence: ${Math.round(analysis.confidence * 100)}%)`,
          {
            rules: analysis.matchedRules,
            element:
              element.tagName +
              (element.className ? `.${element.className}` : ""),
          }
        );
      }
    }

    if (patternRemovedCount > 0) {
      console.log(
        `JustUI: Pattern rules removed ${patternRemovedCount} suspicious elements`
      );
    }
  } catch (error) {
    console.error("JustUI: Error in pattern rule execution:", error);
  }

  return patternRemovedCount;
}

// Execute rules to remove elements
async function executeRules() {
  console.log("JustUI: executeRules called", {
    isActive,
    isDomainWhitelisted: isDomainWhitelisted(currentDomain),
    currentDomain,
  });

  if (!isActive || isDomainWhitelisted(currentDomain)) {
    console.log(
      "JustUI: Skipping execution - extension inactive or domain whitelisted"
    );
    return;
  }

  let removedCount = 0;
  let sessionDefaultRemoved = 0;
  let sessionCustomRemoved = 0;
  let sessionPatternRemoved = 0;

  // Execute default rules
  if (defaultRulesEnabled) {
    const enabledDefaultRules = defaultRules.filter((rule) => rule.enabled);
    enabledDefaultRules.forEach((rule) => {
      if (!ruleAppliesTo(rule, currentDomain)) return;

      try {
        const elements = document.querySelectorAll(rule.selector);
        elements.forEach((element) => {
          // Skip if already processed by JustUI
          if (element.hasAttribute("data-justui-removed")) return;

          // Add a data attribute before removing for debugging
          element.setAttribute("data-justui-removed", rule.id);
          element.style.display = "none";
          // Optional: completely remove from DOM
          // element.remove();
          removedCount++;
          sessionDefaultRemoved++;
        });

        if (elements.length > 0) {
          console.log(
            `JustUI: Default Rule "${rule.description}" removed ${elements.length} elements`
          );
        }
      } catch (error) {
        console.error(`JustUI: Error executing rule "${rule.id}":`, error);
      }
    });
  }

  // Execute custom rules
  if (customRulesEnabled) {
    const enabledCustomRules = customRules.filter((rule) => rule.enabled);
    enabledCustomRules.forEach((rule) => {
      if (!ruleAppliesTo(rule, currentDomain)) return;

      try {
        const elements = document.querySelectorAll(rule.selector);
        elements.forEach((element) => {
          // Skip if already processed by JustUI
          if (element.hasAttribute("data-justui-removed")) return;

          // Add a data attribute before removing for debugging
          element.setAttribute("data-justui-removed", rule.id);
          element.style.display = "none";
          // Optional: completely remove from DOM
          // element.remove();
          removedCount++;
          sessionCustomRemoved++;
        });

        if (elements.length > 0) {
          console.log(
            `JustUI: Custom Rule "${rule.description}" removed ${elements.length} elements`
          );
        }
      } catch (error) {
        console.error(`JustUI: Error executing rule "${rule.id}":`, error);
      }
    });
  }

  // Execute advanced pattern-based detection
  if (patternRulesEnabled) {
    try {
      sessionPatternRemoved = await executePatternRules();
      removedCount += sessionPatternRemoved;
    } catch (error) {
      console.error("JustUI: Error executing pattern rules:", error);
    }
  }

  // Update domain-specific counters (session-only, reset on page refresh)
  if (!domainStats[currentDomain]) {
    domainStats[currentDomain] = {
      defaultRulesRemoved: 0,
      customRulesRemoved: 0,
    };
  }

  // Set absolute values instead of accumulating (session-only counts)
  domainStats[currentDomain].defaultRulesRemoved =
    sessionDefaultRemoved + sessionPatternRemoved;
  domainStats[currentDomain].customRulesRemoved = sessionCustomRemoved;

  if (removedCount > 0) {
    console.log(
      `JustUI: Total elements processed: ${removedCount} (Default: ${sessionDefaultRemoved}, Custom: ${sessionCustomRemoved}, Pattern: ${sessionPatternRemoved})`
    );

    // Store per-domain counts for popup display
    chrome.storage.local.set({
      domainStats,
    });
  }
}

// Initialize content script
async function initialize() {
  currentDomain = getCurrentDomain();
  console.log("JustUI: Initializing on domain:", currentDomain);

  // Initialize advanced detection engine
  if (typeof AdDetectionEngine !== "undefined") {
    adDetectionEngine = new AdDetectionEngine();
    console.log("JustUI: AdDetectionEngine initialized");
  } else {
    console.warn(
      "JustUI: AdDetectionEngine not available, pattern detection disabled"
    );
  }

  // Load initial settings from storage
  chrome.storage.local.get(
    [
      "isActive",
      "whitelist",
      "defaultRules",
      "customRules",
      "defaultRulesEnabled",
      "customRulesEnabled",
      "patternRulesEnabled",
    ],
    (result) => {
      isActive = result.isActive || false;
      whitelist = result.whitelist || [];
      defaultRules = result.defaultRules || [];
      customRules = result.customRules || [];
      defaultRulesEnabled = result.defaultRulesEnabled !== false;
      customRulesEnabled = result.customRulesEnabled !== false;
      patternRulesEnabled = result.patternRulesEnabled !== false;
      // Initialize domainStats as empty object for session-only tracking
      domainStats = {};

      console.log("JustUI: Settings loaded", {
        isActive,
        isDomainWhitelisted: isDomainWhitelisted(currentDomain),
        defaultRulesCount: defaultRules.length,
        customRulesCount: customRules.length,
        defaultRulesEnabled,
        customRulesEnabled,
        patternRulesEnabled,
        adDetectionEngine: !!adDetectionEngine,
      });

      // Execute rules on initial load
      if (isActive && !isDomainWhitelisted(currentDomain)) {
        executeRules();
      }
    }
  );
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "storageChanged") {
    const changes = request.changes;
    let shouldReExecute = false;

    if (changes.isActive) {
      isActive = changes.isActive.newValue;
      shouldReExecute = true;
    }
    if (changes.whitelist) {
      whitelist = changes.whitelist.newValue;
      invalidateWhitelistCache();
      shouldReExecute = true;
    }
    if (changes.defaultRules) {
      defaultRules = changes.defaultRules.newValue;
      shouldReExecute = true;
    }
    if (changes.customRules) {
      customRules = changes.customRules.newValue;
      shouldReExecute = true;
    }
    if (changes.defaultRulesEnabled) {
      defaultRulesEnabled = changes.defaultRulesEnabled.newValue;
      shouldReExecute = true;
    }
    if (changes.customRulesEnabled) {
      customRulesEnabled = changes.customRulesEnabled.newValue;
      shouldReExecute = true;
    }
    if (changes.patternRulesEnabled) {
      patternRulesEnabled = changes.patternRulesEnabled.newValue;
      shouldReExecute = true;
    }

    // Only re-execute rules when settings that affect execution change
    // Don't re-execute when only counts change (prevents infinite loop)
    if (shouldReExecute) {
      executeRules();
    }
  }

  if (request.action === "whitelistUpdated") {
    whitelist = request.whitelist;
    invalidateWhitelistCache();
    executeRules();
  }

  if (request.action === "executeRules") {
    executeRules();
    sendResponse({ success: true });
  }
});

// Observer for dynamically added content
const observer = new MutationObserver((mutations) => {
  if (!isActive || isDomainWhitelisted(currentDomain)) return;

  let shouldExecute = false;
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      shouldExecute = true;
    }
  });

  if (shouldExecute) {
    // Debounce execution to avoid excessive processing
    clearTimeout(window.justUITimeout);
    window.justUITimeout = setTimeout(executeRules, 500);
  }
});

// Start observing DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Clean up on unload
window.addEventListener("beforeunload", () => {
  observer.disconnect();
  clearTimeout(window.justUITimeout);
});
