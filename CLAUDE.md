# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JustUI is a Chrome Extension built with React 19, Vite 7, and Tailwind CSS 4. It provides an element removal system with whitelist management and customizable rules. The extension removes unwanted DOM elements (ads, trackers, etc.) from websites using both default and custom rules. The whitelist contains clean domains that DON'T need element removal - element removal executes on all domains EXCEPT those in the whitelist.

## Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - Build extension to `dist/` directory
- `npm run preview` - Preview production build

## Architecture

**Core Functionality:**
1. **Main Toggle** - Enable/disable entire extension functionality
2. **Whitelist System** - Manage clean domains that are EXEMPT from element removal (trusted sites)
3. **Rule System** - Default and custom rules for element removal
4. **Settings Management** - User configuration interface

**Chrome Extension Structure:**
- `manifest.json` - Chrome Extension Manifest V3 configuration
- `popup.html` - Extension popup entry point (renders to `#popup-root`)
- `settings.html` - Settings page for whitelist and rule management
- `src/popup.jsx` - React entry point
- `src/App.jsx` - Main popup component with toggle, domain status, and quick actions
- `src/settings.jsx` - Settings page React component
- `src/components/ui/` - Reusable UI components
- `src/scripts/content.js` - Content script for DOM manipulation
- `src/scripts/background.js` - Service worker for extension coordination

**Data Storage Schema:**
```javascript
{
  isActive: boolean,                    // Main extension toggle
  whitelist: string[],                  // Clean domains EXEMPT from removal: ['example.com', 'google.com']
  defaultRules: Rule[],                 // Built-in element removal rules
  customRules: Rule[],                  // User-defined rules
  defaultRulesEnabled: boolean,         // Toggle for default rules
  customRulesEnabled: boolean           // Toggle for custom rules
}
```

**Rule Schema:**
```javascript
{
  id: string,                          // Unique identifier
  selector: string,                    // CSS selector for elements
  description: string,                 // Human-readable description
  confidence: 'high' | 'medium' | 'low', // Rule confidence level
  domains: string[],                   // ['*'] for all domains or specific domains
  category: string,                    // 'advertising', 'tracking', etc.
  enabled: boolean                     // Individual rule toggle
}
```

**Component Responsibilities:**

*Popup (src/App.jsx):*
- Main extension toggle
- Current domain whitelist status (shows if domain is exempt from element removal)
- "Add to whitelist" button (when domain is NOT whitelisted - to mark it as clean/trusted)
- "Remove from whitelist" button (when domain IS whitelisted - to enable element removal again)
- Element removal status indicator
- Settings page navigation

*Settings Page (src/settings.jsx):*
- Whitelist CRUD operations
- Default rules toggle panel with individual rule controls
- Custom rule editor with form validation
- Import/export functionality for rules and settings

*Content Script (src/scripts/content.js):*
- Monitor DOM for targeted elements
- Execute active rules based on current domain and whitelist status
- Remove elements matching enabled rule selectors
- Communicate execution results to background script

*Background Script (src/scripts/background.js):*
- Coordinate popup ↔ content script communication
- Handle storage updates and synchronization
- Validate domains and rule execution permissions
- Manage extension lifecycle events

**Build System:**
- Vite builds to `dist/` with a custom plugin that copies `manifest.json` and `icons/` folder
- Uses relative base path (`./`) for Chrome extension compatibility
- PostCSS configured with `@tailwindcss/postcss` plugin

**Extension Permissions:**
- `activeTab` - Access to current tab for domain detection
- `storage` - Chrome storage API for persisting extension state
- `scripting` - Execute content scripts for DOM manipulation

## Development Guidelines

**Data Flow:**
1. User loads page → Content script checks if domain is whitelisted and extension is active
2. If active and NOT whitelisted → Execute enabled rules (default + custom)
3. Content script removes matching elements from DOM
4. If domain IS whitelisted → Skip element removal (domain is clean/trusted)
5. Popup displays current domain status and quick actions

**Element Removal Logic:**
- Extension must be active (`isActive = true`)
- Domain must NOT be in whitelist (whitelist = clean domains that don't need cleanup)
- At least one rule set must be enabled (defaultRules or customRules)
- Elements are removed when: `isActive && !isDomainWhitelisted(currentDomain)`

**Default Rules:**
Initialize extension with common element removal rules for advertising, tracking, and annoyances. Store in `defaultRules` array with categories like:
- `advertising` - Ad networks, sponsored content
- `tracking` - Analytics scripts, tracking pixels
- `social` - Social media widgets
- `popup` - Modal overlays, newsletter signups

**Default Whitelist:**
Initialize extension with common clean/trusted domains that DON'T need element removal. Store in `src/data/defaultWhitelist.json`:
- Trusted development tools and documentation sites
- Essential web services with clean UIs
- User-preferred sites without intrusive ads
- Users can add/remove domains as needed - these are just sensible defaults for clean sites

**Storage Keys:**
- `isActive` - Main extension toggle
- `whitelist` - Array of clean/trusted domains EXEMPT from element removal
- `defaultRules` - Built-in rules array
- `customRules` - User-created rules array
- `defaultRulesEnabled` - Boolean for default rules toggle
- `customRulesEnabled` - Boolean for custom rules toggle

**Domain Handling:**
- Extract domain from current tab URL using `new URL(tab.url).hostname`
- Support subdomain matching (e.g., `*.example.com`)
- Store domains without protocol (no `https://`)

**Testing Extension:**
1. Run `npm run build` to build to `dist/`
2. Open Chrome → Extensions → Developer mode → Load unpacked → Select `dist/` folder
3. Test popup, settings page, and content script functionality
4. Use Chrome DevTools → Console to debug content script
5. Use Extension DevTools to debug popup and background script
