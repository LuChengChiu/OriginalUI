/**
 * Ad HTML Samples for Integration Testing
 *
 * @fileoverview Contains realistic HTML samples for testing ad blocking functionality.
 * Includes both ad patterns (should be blocked) and legitimate content (should NOT be blocked).
 */

export const adHTMLSamples = {
  // ========== COMMON AD PATTERNS (SHOULD BE BLOCKED) ==========

  bannerAd: `
    <div class="ad-banner advertisement">
      <img src="banner.jpg" alt="Ad">
      <a href="https://ads.example.com">Click here</a>
    </div>
  `,

  sidebarAd: `
    <aside id="sidebar-ads" class="ad-container">
      <div class="ad-widget">
        <iframe src="https://doubleclick.net/ad"></iframe>
      </div>
    </aside>
  `,

  inlineAd: `
    <div class="content">
      <p>Paragraph 1</p>
      <div class="ad-inline sponsored-content">
        <img src="inline-ad.jpg" alt="Sponsored">
        <p>Advertisement content</p>
      </div>
      <p>Paragraph 2</p>
    </div>
  `,

  videoAd: `
    <div class="video-container">
      <div class="ad-overlay">
        <div class="ad-video-player">
          <iframe src="https://ads.video.com/preroll"></iframe>
        </div>
      </div>
      <video src="actual-video.mp4"></video>
    </div>
  `,

  popupAd: `
    <div class="popup-ad modal-ad" style="position: fixed; z-index: 9999;">
      <div class="ad-content">
        <h2>Special Offer!</h2>
        <button class="close-ad">Close</button>
      </div>
    </div>
  `,

  nativeAd: `
    <article class="sponsored-post ad-article">
      <img src="sponsored-thumb.jpg">
      <h3>Sponsored: Amazing Product</h3>
      <p>This is a native advertisement...</p>
      <span class="ad-label">Sponsored</span>
    </article>
  `,

  // ========== LEGITIMATE CONTENT (SHOULD NOT BE BLOCKED) ==========

  heroSection: `
    <section id="hero_image" class="hero-section">
      <h1>Welcome to Our Site</h1>
      <p>Main content that users want to see</p>
      <button class="cta-button">Get Started</button>
    </section>
  `,

  navigation: `
    <header class="site-header">
      <nav class="navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  `,

  mainContent: `
    <main class="main-content">
      <article class="blog-post">
        <h1>Blog Post Title</h1>
        <p>Legitimate article content...</p>
      </article>
    </main>
  `,

  footer: `
    <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; 2025 Company Name</p>
        <nav class="footer-nav">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
      </div>
    </footer>
  `,

  sidebar: `
    <aside class="sidebar">
      <div class="widget">
        <h3>Recent Posts</h3>
        <ul>
          <li><a href="/post1">Post 1</a></li>
          <li><a href="/post2">Post 2</a></li>
        </ul>
      </div>
    </aside>
  `,

  // ========== EDGE CASES ==========

  obfuscatedAd: `
    <div class="AdBanner ADVERTISEMENT ad_container AdWidget">
      <span class="ADS_INLINE">
        <!-- Multiple class variations to test case-insensitive matching -->
      </span>
    </div>
  `,

  nestedAd: `
    <div class="wrapper">
      <div class="container">
        <div class="ad-placement advertising-slot">
          <iframe src="https://ads.network.com/banner"></iframe>
        </div>
      </div>
    </div>
  `,

  scriptAd: `
    <script type="text/javascript" src="https://ads.example.com/ad.js" class="ad-script"></script>
    <script class="advertising-code">
      // Ad script content
      window.showAd('banner-123');
    </script>
  `,

  linkAd: `
    <link rel="stylesheet" href="https://ads.example.com/ad-styles.css" class="ad-styles">
  `,

  // ========== FRAMEWORK-MANAGED CONTENT ==========

  reactAd: `
    <div data-reactroot class="ad-widget">
      <span>React-managed ad component</span>
      <img src="react-ad.jpg">
    </div>
  `,

  vueAd: `
    <div data-v-7f6a8b4e class="advertisement">
      <span>Vue-managed ad component</span>
      <img src="vue-ad.jpg">
    </div>
  `,

  angularAd: `
    <div ng-app="adApp" class="ad-banner">
      <span>Angular-managed ad component</span>
      <img src="angular-ad.jpg">
    </div>
  `,

  // ========== DYNAMIC INJECTION TARGETS ==========

  dynamicContainer: `
    <div id="ad-container" class="dynamic-ads">
      <!-- Ads will be injected here via JavaScript -->
    </div>
  `,

  lazyLoadAd: `
    <div class="ad-lazy-load" data-ad-src="https://ads.example.com/lazy-ad">
      <!-- Placeholder for lazy-loaded ad -->
    </div>
  `,

  // ========== COMPLEX AD PATTERNS ==========

  stickyAd: `
    <div class="ad-sticky" style="position: sticky; top: 0;">
      <div class="ad-content">
        <iframe src="https://ads.sticky.com/banner"></iframe>
      </div>
    </div>
  `,

  multipleAds: `
    <div class="page-content">
      <header>Header content</header>
      <div class="ad-banner top-ad">Top Banner Ad</div>
      <main>
        <p>Content paragraph 1</p>
        <div class="ad-inline mid-content-ad">Inline Ad</div>
        <p>Content paragraph 2</p>
      </main>
      <aside class="sidebar-ads">
        <div class="ad-widget">Sidebar Ad 1</div>
        <div class="ad-widget">Sidebar Ad 2</div>
      </aside>
      <footer>Footer content</footer>
    </div>
  `,

  // ========== FALSE POSITIVE TEST CASES ==========

  // These should NOT be blocked despite containing ad-related tokens
  falsePositiveSection: `
    <section class="section feature-section">
      <!-- Class "section" matches token but ".ad-section" selector should fail -->
      <h2>Features</h2>
      <p>Legitimate content</p>
    </section>
  `,

  falsePositiveHeader: `
    <header class="header site-header">
      <!-- Class "header" matches token but ".ad-header" selector should fail -->
      <h1>Site Title</h1>
    </header>
  `,

  falsePositiveContent: `
    <div class="content main-content">
      <!-- Class "content" matches token but ".ad-content" selector should fail -->
      <p>Main article text</p>
    </div>
  `,

  // ========== PERFORMANCE TEST PATTERNS ==========

  largePageWithAds: `
    <div class="page">
      ${Array.from({ length: 100 }, (_, i) => `
        <div class="content-block" id="block-${i}">
          <h3>Content Block ${i}</h3>
          <p>Lorem ipsum dolor sit amet...</p>
          ${i % 10 === 0 ? '<div class="ad-banner">Ad</div>' : ''}
        </div>
      `).join('\n')}
    </div>
  `,

  deepNesting: `
    <div class="level-1">
      <div class="level-2">
        <div class="level-3">
          <div class="level-4">
            <div class="level-5">
              <div class="ad-banner deeply-nested-ad">
                <!-- Testing performance with deep DOM nesting -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

/**
 * Helper function to create a DOM element from HTML string
 * @param {string} html - HTML string
 * @returns {Element} DOM element
 */
export function createElementFromHTML(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/**
 * Helper function to get all descendants of an element
 * @param {Element} element - Root element
 * @returns {Element[]} Array of descendant elements
 */
export function getAllDescendants(element) {
  const descendants = [];
  const traverse = (node) => {
    for (const child of node.children) {
      descendants.push(child);
      traverse(child);
    }
  };
  traverse(element);
  return descendants;
}
