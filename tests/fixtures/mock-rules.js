/**
 * Mock Rules for Integration Testing
 *
 * @fileoverview Contains various rule sets for testing the rule execution pipeline.
 * Includes simple selectors, complex selectors, domain-specific rules, and EasyList format samples.
 */

/**
 * Simple CSS selector rules for basic testing
 */
export const simpleRules = [
  {
    id: 'rule-1',
    selector: '.ad-banner',
    description: 'Block elements with ad-banner class',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-2',
    selector: '#sidebar-ads',
    description: 'Block sidebar ads container',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-3',
    selector: '.advertisement',
    description: 'Block advertisement elements',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-4',
    selector: '.ad-inline',
    description: 'Block inline ads',
    confidence: 'medium',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-5',
    selector: '.sponsored-content',
    description: 'Block sponsored content',
    confidence: 'medium',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  }
];

/**
 * Complex CSS selector rules for advanced testing
 */
export const complexRules = [
  {
    id: 'rule-6',
    selector: '[class^="ad-"]',
    description: 'Block elements with classes starting with ad-',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-7',
    selector: '[class*="advertisement"]',
    description: 'Block elements containing advertisement in class',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-8',
    selector: 'iframe[src*="doubleclick"]',
    description: 'Block DoubleClick iframes',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-9',
    selector: 'iframe[src*="ads"]',
    description: 'Block ad iframes',
    confidence: 'medium',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-10',
    selector: 'div.widget:not(.featured)',
    description: 'Block non-featured widgets',
    confidence: 'low',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-11',
    selector: 'div.container > .ad',
    description: 'Block direct ad children of containers',
    confidence: 'medium',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  }
];

/**
 * Domain-specific rules for testing domain filtering
 */
export const domainRules = [
  {
    id: 'rule-12',
    selector: '.promo-box',
    description: 'Block promo boxes on example.com',
    confidence: 'high',
    domains: ['example.com'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-13',
    selector: '.sponsored',
    description: 'Block sponsored content on example.com subdomains',
    confidence: 'high',
    domains: ['*.example.com'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-14',
    selector: '.site-specific-ad',
    description: 'Block site-specific ads',
    confidence: 'high',
    domains: ['news.example.com', 'blog.example.com'],
    category: 'advertising',
    enabled: true
  }
];

/**
 * EasyList format rules (raw lines) for parser testing
 */
export const easylistSample = [
  '! Comment line - should be ignored',
  '! Another comment',
  '##.ad-banner',
  '##.advertisement',
  '##[class*="ad"]',
  '##[class^="ad-"]',
  '##iframe[src*="ads"]',
  '##iframe[src*="doubleclick"]',
  '##.sponsored-content',
  '##.ad-inline',
  'example.com##.site-specific-ad',
  '*.example.com##.sponsored',
  '##div.ad-container > iframe',
  '##.popup-ad',
  '##.modal-ad'
];

/**
 * False positive test rules - these should match tokens but not actual elements
 */
export const falsePositiveRules = [
  {
    id: 'rule-15',
    selector: '.ad-section',
    description: 'Should NOT match .section (false positive test)',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-16',
    selector: '.ad-header',
    description: 'Should NOT match .header (false positive test)',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-17',
    selector: '.ad-content',
    description: 'Should NOT match .content (false positive test)',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  }
];

/**
 * Script and link tag rules for testing tiered removal
 */
export const scriptAndLinkRules = [
  {
    id: 'rule-18',
    selector: 'script.ad-script',
    description: 'Block ad scripts (should be removed, not hidden)',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-19',
    selector: 'script[src*="ads"]',
    description: 'Block script tags with ads in src',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  },
  {
    id: 'rule-20',
    selector: 'link.ad-styles',
    description: 'Block ad stylesheets',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: true
  }
];

/**
 * Performance test rules - large rule set for performance testing
 */
export const performanceRules = Array.from({ length: 100 }, (_, i) => ({
  id: `perf-rule-${i}`,
  selector: `.ad-variant-${i}`,
  description: `Performance test rule ${i}`,
  confidence: 'medium',
  domains: ['*'],
  category: 'advertising',
  enabled: true
}));

/**
 * Disabled rules - should not be executed
 */
export const disabledRules = [
  {
    id: 'rule-disabled-1',
    selector: '.disabled-ad',
    description: 'This rule is disabled',
    confidence: 'high',
    domains: ['*'],
    category: 'advertising',
    enabled: false
  }
];

/**
 * All rules combined for comprehensive testing
 */
export const allRules = [
  ...simpleRules,
  ...complexRules,
  ...domainRules,
  ...scriptAndLinkRules
];

/**
 * Mock EasyList data object for EasyListRuleSource testing
 */
export const mockEasyListData = {
  selectors: [
    '.ad-banner',
    '.advertisement',
    '[class*="ad"]',
    'iframe[src*="doubleclick"]',
    '.sponsored-content',
    '.ad-inline',
    'div.ad-container > iframe'
  ]
};

/**
 * Helper function to convert EasyList format to selector array
 * @param {string[]} easylistLines - Array of EasyList format lines
 * @returns {string[]} Array of CSS selectors
 */
export function parseEasyListFormat(easylistLines) {
  return easylistLines
    .filter(line => !line.startsWith('!')) // Remove comments
    .map(line => {
      // Handle domain-specific rules: domain.com##selector → selector
      if (line.includes('##')) {
        return line.split('##')[1];
      }
      return line;
    })
    .filter(Boolean);
}

/**
 * Helper function to filter rules by domain
 * @param {Object[]} rules - Array of rule objects
 * @param {string} domain - Domain to filter by
 * @returns {Object[]} Filtered rules
 */
export function filterRulesByDomain(rules, domain) {
  return rules.filter(rule => {
    if (rule.domains.includes('*')) return true;
    if (rule.domains.includes(domain)) return true;

    // Check for subdomain wildcards: *.example.com
    return rule.domains.some(ruleDomain => {
      if (ruleDomain.startsWith('*.')) {
        const baseDomain = ruleDomain.substring(2);
        return domain.endsWith(baseDomain);
      }
      return false;
    });
  });
}

/**
 * Helper function to get only enabled rules
 * @param {Object[]} rules - Array of rule objects
 * @returns {Object[]} Enabled rules only
 */
export function getEnabledRules(rules) {
  return rules.filter(rule => rule.enabled !== false);
}

/**
 * Mock token index for testing
 * @param {string[]} selectors - Array of CSS selectors
 * @returns {Map<string, string[]>} Token index map
 */
export function createMockTokenIndex(selectors) {
  const index = new Map();

  for (const selector of selectors) {
    // Extract class names: .ad-banner → "ad-banner"
    const classMatches = selector.match(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g);
    if (classMatches) {
      for (const match of classMatches) {
        const token = match.substring(1);
        if (!index.has(token)) {
          index.set(token, []);
        }
        index.get(token).push(selector);
      }
    }

    // Extract IDs: #ad-top → "ad-top"
    const idMatches = selector.match(/#([a-zA-Z_][a-zA-Z0-9_-]*)/g);
    if (idMatches) {
      for (const match of idMatches) {
        const token = match.substring(1);
        if (!index.has(token)) {
          index.set(token, []);
        }
        index.get(token).push(selector);
      }
    }

    // Extract tag names: div.ad → "div"
    const tagMatch = selector.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
    if (tagMatch) {
      const token = tagMatch[1].toLowerCase();
      if (!index.has(token)) {
        index.set(token, []);
      }
      index.get(token).push(selector);
    }
  }

  return index;
}
