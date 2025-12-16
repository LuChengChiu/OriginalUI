// Advanced Ad Detection Engine for JustUI Chrome Extension
// Implements pattern-based detection rules with weighted scoring

class AdDetectionEngine {
  constructor() {
    // Detection rule weights and thresholds
    this.rules = [
      {
        name: "HIGH_Z_OVERLAY",
        weight: 10,
        detector: this.detectHighZIndexOverlay,
      },
      { name: "CLICK_HIJACK", weight: 9, detector: this.detectClickHijacking },
      {
        name: "SUSPICIOUS_IFRAME",
        weight: 8,
        detector: this.detectSuspiciousIframe,
      },
      {
        name: "MALICIOUS_DOMAIN",
        weight: 7,
        detector: this.detectMaliciousDomain,
      },
      { name: "SCAM_LANGUAGE", weight: 5, detector: this.detectScamLanguage },
      {
        name: "INTERACTION_BLOCKING",
        weight: 4,
        detector: this.detectInteractionBlocking,
      },
      {
        name: "PROTOCOL_RELATIVE_URL",
        weight: 3,
        detector: this.detectProtocolRelativeUrls,
      },
    ];

    this.threshold = 15; // Configurable threshold for detection
    this.confidenceThreshold = 0.7; // Minimum confidence to mark as suspicious

    // Suspicious TLD patterns
    this.suspiciousTLDs =
      /\.(shop|xyz|top|buzz|click|online|site|tk|ml|ga|cf)$/i;

    // Random domain name patterns
    this.randomNamePatterns =
      /^[a-z]{8,15}(stam|earn|safe|secure|buy|deal)[a-z]{4,10}\./i;

    // Suspicious path patterns
    this.hashPaths = /\/[a-f0-9]{32,64}\//;
    this.deepPaths = /\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\//;

    // Multilingual scam patterns
    this.scamPatterns = {
      urgency: {
        en: /\b(limited time|act now|hurry|ending soon|last chance|today only|expires|urgent|immediate)\b/i,
        zh: /(立即|马上|限时|结束|最后机会|仅限今天|过期|紧急)/,
        es: /\b(tiempo limitado|actúa ahora|última oportunidad|urgente|inmediato)\b/i,
        fr: /\b(temps limité|agir maintenant|dernière chance|urgent|immédiat)\b/i,
      },
      savings: {
        en: /\b(save|discount|off|deal|huge savings|\d{2,3}% off|free|win|prize|special offer)\b/i,
        zh: /(折扣|优惠|省|减|巨额储蓄|免费|赢|奖品|特别优惠)/,
        es: /\b(descuento|ahorro|oferta|gratis|ganar|premio|oferta especial)\b/i,
        fr: /\b(réduction|économie|offre|gratuit|gagner|prix|offre spéciale)\b/i,
      },
      action: {
        en: /\b(click here|download now|install|register|sign up|claim|get)\b/i,
        zh: /(点击这里|立即下载|安装|注册|注册|声明|获得)/,
        es: /\b(haga clic aquí|descargar ahora|instalar|registrarse|reclamar|obtener)\b/i,
        fr: /\b(cliquez ici|télécharger maintenant|installer|s'inscrire|réclamer|obtenir)\b/i,
      },
    };
  }

  // Main analysis function
  async analyze(element) {
    try {
      let totalScore = 0;
      const matchedRules = [];
      const detectionResults = {};

      // Run all detection rules
      for (const rule of this.rules) {
        try {
          const result = await rule.detector.call(this, element);
          detectionResults[rule.name] = result;

          if (result.isMatch) {
            totalScore += rule.weight;
            matchedRules.push({
              rule: rule.name,
              score: rule.weight,
              details: result,
            });
          }
        } catch (error) {
          console.warn(`JustUI: Error executing rule ${rule.name}:`, error);
        }
      }

      const confidence = Math.min(totalScore / 30, 1.0); // Normalize to 0-1
      const isAd =
        totalScore >= this.threshold && confidence >= this.confidenceThreshold;

      return {
        isAd,
        confidence,
        totalScore,
        matchedRules,
        detectionResults,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("JustUI: Error in AdDetectionEngine.analyze:", error);
      return {
        isAd: false,
        confidence: 0,
        totalScore: 0,
        matchedRules: [],
        detectionResults: {},
        error: error.message,
      };
    }
  }

  // Phase 1: High-confidence detection rules

  // Z-Index + Overlay Detection (P0, 95% confidence)
  detectHighZIndexOverlay(element) {
    try {
      const style = window.getComputedStyle(element);
      const zIndex = parseInt(style.zIndex);
      const position = style.position;
      const rect = element.getBoundingClientRect();

      const isHighZIndex = zIndex > 2147483647;
      const isFixed = position === "fixed";
      const coversScreen =
        rect.width >= window.innerWidth * 0.8 &&
        rect.height >= window.innerHeight * 0.8;

      // Additional checks for legitimacy
      const hasCloseButton = element.querySelector(
        '[class*="close"], [class*="dismiss"], .modal-close'
      );
      const isVideoPlayer =
        element.closest(".video-player, .player-container") !== null;
      const isLegitModal =
        element.classList.contains("modal") ||
        element.getAttribute("role") === "dialog";

      const score = isHighZIndex && isFixed && coversScreen ? 10 : 0;

      // Reduce score for legitimate use cases
      let adjustedScore = score;
      if (hasCloseButton && isLegitModal) adjustedScore -= 3;
      if (isVideoPlayer) adjustedScore -= 5;

      return {
        isMatch: adjustedScore >= 7,
        score: adjustedScore,
        rule: "HIGH_Z_OVERLAY",
        details: {
          zIndex,
          position,
          screenCoverage: { width: rect.width, height: rect.height },
          hasCloseButton,
          isVideoPlayer,
          isLegitModal,
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "HIGH_Z_OVERLAY",
        error: error.message,
      };
    }
  }

  // Click Hijacking Detection (P0, 90% confidence)
  detectClickHijacking(element) {
    try {
      // Check for window.open in onclick handlers
      const onclickAttr = element.getAttribute("onclick");
      const hasWindowOpen = onclickAttr && onclickAttr.includes("window.open");

      // Check for suspicious event listeners
      const hasDataRedirect =
        element.hasAttribute("data-href") ||
        element.hasAttribute("data-url") ||
        element.hasAttribute("data-redirect");

      // Check for overlay with pointer cursor
      const style = window.getComputedStyle(element);
      const isClickableOverlay =
        style.cursor === "pointer" &&
        (style.position === "fixed" || style.position === "absolute");

      // Check for suspicious external links
      const links = element.querySelectorAll("a[href]");
      let suspiciousLinkCount = 0;
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (
          href &&
          href.startsWith("http") &&
          !href.includes(window.location.hostname)
        ) {
          suspiciousLinkCount++;
        }
      });

      let score = 0;
      if (hasWindowOpen) score += 9;
      if (hasDataRedirect && isClickableOverlay) score += 6;
      if (suspiciousLinkCount > 3) score += 4;

      return {
        isMatch: score >= 6,
        score,
        rule: "CLICK_HIJACK",
        details: {
          hasWindowOpen,
          hasDataRedirect,
          isClickableOverlay,
          suspiciousLinkCount,
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "CLICK_HIJACK",
        error: error.message,
      };
    }
  }

  // Suspicious Iframe Detection (P0, 85% confidence)
  detectSuspiciousIframe(iframe) {
    try {
      if (iframe.tagName !== "IFRAME") {
        return { isMatch: false, score: 0, rule: "SUSPICIOUS_IFRAME" };
      }

      const hasSrcdoc = iframe.hasAttribute("srcdoc");
      const sandbox = iframe.getAttribute("sandbox");
      const src = iframe.getAttribute("src");

      const allowsPopups = sandbox && sandbox.includes("allow-popups");
      const allowsScripts = sandbox && sandbox.includes("allow-scripts");
      const allowsSameOrigin = sandbox && sandbox.includes("allow-same-origin");

      // Check for suspicious source URLs
      const suspiciousSrc =
        src &&
        (this.suspiciousTLDs.test(src) ||
          src.includes("doubleclick") ||
          src.includes("googlesyndication") ||
          src.includes("ads") ||
          src.includes("popup"));

      let score = 0;
      if (hasSrcdoc && allowsPopups && allowsScripts) score += 8;
      if (suspiciousSrc) score += 6;
      if (allowsPopups && allowsSameOrigin && allowsScripts) score += 5;

      return {
        isMatch: score >= 5,
        score,
        rule: "SUSPICIOUS_IFRAME",
        details: {
          hasSrcdoc,
          sandbox,
          src,
          allowsPopups,
          allowsScripts,
          allowsSameOrigin,
          suspiciousSrc,
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "SUSPICIOUS_IFRAME",
        error: error.message,
      };
    }
  }

  // Phase 2: Domain & Network Pattern Rules

  // Malicious Domain Detection (P1, 80% confidence)
  detectMaliciousDomain(element) {
    try {
      const links = element.querySelectorAll("a[href], iframe[src]");
      let maxScore = 0;
      let suspiciousDomains = [];

      links.forEach((link) => {
        const url = link.getAttribute("href") || link.getAttribute("src");
        if (!url || !url.startsWith("http")) return;

        try {
          const urlObj = new URL(url);
          let domainScore = 0;

          // Check suspicious TLDs
          if (this.suspiciousTLDs.test(urlObj.hostname)) domainScore += 3;

          // Check random name patterns
          if (this.randomNamePatterns.test(urlObj.hostname)) domainScore += 4;

          // Check suspicious paths
          if (this.hashPaths.test(urlObj.pathname)) domainScore += 2;
          if (this.deepPaths.test(urlObj.pathname)) domainScore += 2;

          if (domainScore >= 3) {
            suspiciousDomains.push({
              domain: urlObj.hostname,
              score: domainScore,
              url,
            });
            maxScore = Math.max(maxScore, domainScore);
          }
        } catch (urlError) {
          // Invalid URL, potentially suspicious
        }
      });

      return {
        isMatch: maxScore >= 5,
        score: maxScore,
        rule: "MALICIOUS_DOMAIN",
        details: {
          suspiciousDomains,
          totalLinks: links.length,
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "MALICIOUS_DOMAIN",
        error: error.message,
      };
    }
  }

  // Phase 3: Content & Behavioral Pattern Rules

  // Scam Language Detection (P1, 75% confidence)
  detectScamLanguage(element) {
    try {
      const text = element.innerText || "";
      if (text.length < 10) {
        return { isMatch: false, score: 0, rule: "SCAM_LANGUAGE" };
      }

      let matches = 0;
      let matchedPatterns = [];

      // Check all language patterns
      for (const [category, languagePatterns] of Object.entries(
        this.scamPatterns
      )) {
        for (const [language, pattern] of Object.entries(languagePatterns)) {
          if (pattern.test(text)) {
            matches++;
            matchedPatterns.push(`${category}-${language}`);
          }
        }
      }

      const score = matches * 2;

      return {
        isMatch: matches >= 2,
        score,
        rule: "SCAM_LANGUAGE",
        details: {
          textLength: text.length,
          matches,
          matchedPatterns,
          textPreview: text.substring(0, 100),
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "SCAM_LANGUAGE",
        error: error.message,
      };
    }
  }

  // User Interaction Blocking Detection (P2, 70% confidence)
  detectInteractionBlocking(element) {
    try {
      const style = window.getComputedStyle(element);

      const blocksSelection = style.userSelect === "none";
      const hidesOverflow = style.overflow === "hidden";
      const preventsInteraction = style.pointerEvents === "none";
      const hasHighOpacity = parseFloat(style.opacity) > 0.8;

      // Check if it's covering a large area
      const rect = element.getBoundingClientRect();
      const coversLargeArea =
        rect.width * rect.height > window.innerWidth * window.innerHeight * 0.3;

      let score = 0;
      if (blocksSelection && coversLargeArea) score += 2;
      if (hidesOverflow && element === document.body) score += 3;
      if (preventsInteraction && hasHighOpacity) score += 2;

      return {
        isMatch: score >= 4,
        score,
        rule: "INTERACTION_BLOCKING",
        details: {
          blocksSelection,
          hidesOverflow,
          preventsInteraction,
          hasHighOpacity,
          coversLargeArea,
          elementArea: rect.width * rect.height,
          viewportArea: window.innerWidth * window.innerHeight,
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "INTERACTION_BLOCKING",
        error: error.message,
      };
    }
  }

  // Protocol Relative URL Detection (P2, 60% confidence)
  detectProtocolRelativeUrls(element) {
    try {
      const links = element.querySelectorAll(
        "a[href], img[src], iframe[src], script[src]"
      );
      let protocolRelativeCount = 0;

      links.forEach((link) => {
        const url = link.getAttribute("href") || link.getAttribute("src");
        if (url && url.startsWith("//")) {
          protocolRelativeCount++;
        }
      });

      const score = protocolRelativeCount > 2 ? 3 : 0;

      return {
        isMatch: protocolRelativeCount > 2,
        score,
        rule: "PROTOCOL_RELATIVE_URL",
        details: {
          protocolRelativeCount,
          totalElements: links.length,
        },
      };
    } catch (error) {
      return {
        isMatch: false,
        score: 0,
        rule: "PROTOCOL_RELATIVE_URL",
        error: error.message,
      };
    }
  }

  // Update detection threshold
  setThreshold(newThreshold) {
    this.threshold = Math.max(0, Math.min(100, newThreshold));
  }

  // Get rule configuration
  getRuleConfig() {
    return this.rules.map((rule) => ({
      name: rule.name,
      weight: rule.weight,
      enabled: true, // Default to enabled
    }));
  }

  // Enable/disable specific rules
  configureRule(ruleName, enabled, weight = null) {
    const rule = this.rules.find((r) => r.name === ruleName);
    if (rule) {
      rule.enabled = enabled;
      if (weight !== null) {
        rule.weight = Math.max(0, Math.min(10, weight));
      }
    }
  }
}

// Export for use in content script
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdDetectionEngine;
} else if (typeof window !== "undefined") {
  window.AdDetectionEngine = AdDetectionEngine;
}
