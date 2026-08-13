/**
 * tests/empirical_challenger_m2_1.mjs
 * Empirical Stress Harness & Verification Suite for Milestone 2 Challenger 1:
 * - Theme toggling (class="dark" on document.documentElement)
 * - Inline FOUC prevention script behavior & exception resilience
 * - LocalStorage persistence and fallback behavior
 * - Responsive 1-3 col grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
 * - pnpm run build execution verification
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const DIST_INDEX_PATH = path.join(ROOT_DIR, 'dist', 'index.html');

console.log('====================================================');
console.log(' EMPIRICAL CHALLENGER M2-1 TEST HARNESS RUNNER');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;
const results = [];

function runTestCase(id, description, testFn) {
  try {
    testFn();
    passCount++;
    results.push({ id, description, status: 'PASS' });
    console.log(`[PASS] ${id}: ${description}`);
  } catch (err) {
    failCount++;
    results.push({ id, description, status: 'FAIL', error: err.message });
    console.error(`[FAIL] ${id}: ${description}`);
    console.error(`       Error: ${err.message}`);
  }
}

// Ensure dist/index.html exists
if (!fs.existsSync(DIST_INDEX_PATH)) {
  console.log('dist/index.html not found. Building project first...');
  execSync('pnpm run build', { stdio: 'inherit' });
}

const htmlContent = fs.readFileSync(DIST_INDEX_PATH, 'utf-8');

// --- Helper: Mock DOM Environment for script execution ---
function createMockEnvironment({ savedTheme = null, prefersDark = false, throwOnLocalStorage = false } = {}) {
  const classList = new Set();
  const attributes = new Map([['id', 'theme-toggle'], ['aria-pressed', 'false']]);
  const eventListeners = {};

  const toggleBtn = {
    getAttribute(attr) {
      return attributes.get(attr) || null;
    },
    setAttribute(attr, val) {
      attributes.set(attr, String(val));
    },
    addEventListener(event, fn) {
      eventListeners[event] = eventListeners[event] || [];
      eventListeners[event].push(fn);
    },
    click() {
      if (eventListeners['click']) {
        eventListeners['click'].forEach(fn => fn());
      }
    }
  };

  const documentElement = {
    classList: {
      add(cls) { classList.add(cls); },
      remove(cls) { classList.delete(cls); },
      toggle(cls) {
        if (classList.has(cls)) {
          classList.delete(cls);
          return false;
        } else {
          classList.add(cls);
          return true;
        }
      },
      contains(cls) { return classList.has(cls); }
    }
  };

  let localStorageStore = {};
  if (savedTheme !== null) {
    localStorageStore['theme'] = savedTheme;
  }

  const localStorageMock = {
    getItem(key) {
      if (throwOnLocalStorage) {
        throw new Error('SecurityError: Access to localStorage is denied');
      }
      return localStorageStore[key] || null;
    },
    setItem(key, val) {
      if (throwOnLocalStorage) {
        throw new Error('QuotaExceededError: DOMException');
      }
      localStorageStore[key] = String(val);
    }
  };

  const documentMock = {
    documentElement,
    readyState: 'complete',
    getElementById(id) {
      if (id === 'theme-toggle') return toggleBtn;
      return null;
    },
    addEventListener(event, fn) {
      eventListeners[event] = eventListeners[event] || [];
      eventListeners[event].push(fn);
    }
  };

  const windowMock = {
    matchMedia(query) {
      return {
        matches: prefersDark,
        media: query
      };
    }
  };

  const sandbox = {
    document: documentMock,
    window: windowMock,
    localStorage: localStorageMock,
    console
  };

  vm.createContext(sandbox);
  return { sandbox, documentElement, toggleBtn, localStorageStore, eventListeners };
}

// Extract Inline Head FOUC Script from HTML
function extractFoucScript(html) {
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  assert.ok(headMatch, 'HTML must contain <head> tag');
  const headContent = headMatch[0];
  
  // Find script containing 'localStorage.getItem' or 'prefers-color-scheme'
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(headContent)) !== null) {
    const scriptBody = match[1];
    if (scriptBody.includes('localStorage') || scriptBody.includes('prefers-color-scheme')) {
      return scriptBody;
    }
  }
  return null;
}

// Extract ThemeToggle Script from HTML
function extractToggleScript(html) {
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const scriptBody = match[1];
    if (scriptBody.includes('setupThemeToggle') || scriptBody.includes('theme-toggle')) {
      return scriptBody;
    }
  }
  return null;
}

// ----------------------------------------------------
// TEST SUITE EXECUTION
// ----------------------------------------------------

// 1. Build Verification
runTestCase('CHALLENGE-01', 'Verification of pnpm run build command', () => {
  const res = execSync('pnpm run build', { encoding: 'utf-8' });
  assert.ok(res.includes('Complete!') || fs.existsSync(DIST_INDEX_PATH), 'Build must succeed and produce dist/index.html');
});

// 2. FOUC Inline Script Extraction
const foucScript = extractFoucScript(htmlContent);
runTestCase('CHALLENGE-02', 'FOUC prevention inline script presence in <head>', () => {
  assert.ok(foucScript !== null, 'Inline FOUC script must be present in <head>');
  assert.ok(foucScript.includes('localStorage.getItem(\'theme\')'), 'FOUC script must read localStorage theme key');
  assert.ok(foucScript.includes('matchMedia'), 'FOUC script must query prefers-color-scheme');
});

// 3. FOUC Script - Explicit 'dark' in localStorage
runTestCase('CHALLENGE-03', 'FOUC script sets dark class when localStorage.getItem("theme") === "dark"', () => {
  const { sandbox, documentElement } = createMockEnvironment({ savedTheme: 'dark', prefersDark: false });
  vm.runInContext(foucScript, sandbox);
  assert.ok(documentElement.classList.contains('dark'), 'documentElement must have "dark" class when theme is "dark"');
});

// 4. FOUC Script - Explicit 'light' in localStorage
runTestCase('CHALLENGE-04', 'FOUC script removes dark class when localStorage.getItem("theme") === "light"', () => {
  const { sandbox, documentElement } = createMockEnvironment({ savedTheme: 'light', prefersDark: true });
  vm.runInContext(foucScript, sandbox);
  assert.ok(!documentElement.classList.contains('dark'), 'documentElement must NOT have "dark" class when theme is "light"');
});

// 5. FOUC Script - System Dark Mode Preference (No localStorage)
runTestCase('CHALLENGE-05', 'FOUC script falls back to system dark preference when no localStorage', () => {
  const { sandbox, documentElement } = createMockEnvironment({ savedTheme: null, prefersDark: true });
  vm.runInContext(foucScript, sandbox);
  assert.ok(documentElement.classList.contains('dark'), 'documentElement must have "dark" class when prefersDark is true');
});

// 6. FOUC Script - System Light Mode Preference (No localStorage)
runTestCase('CHALLENGE-06', 'FOUC script falls back to system light preference when no localStorage', () => {
  const { sandbox, documentElement } = createMockEnvironment({ savedTheme: null, prefersDark: false });
  vm.runInContext(foucScript, sandbox);
  assert.ok(!documentElement.classList.contains('dark'), 'documentElement must NOT have "dark" class when prefersDark is false');
});

// 7. FOUC Script - Restricted LocalStorage Access Exception Resilience
runTestCase('CHALLENGE-07', 'FOUC script gracefully handles SecurityError/DOMException on localStorage.getItem', () => {
  const { sandbox, documentElement } = createMockEnvironment({ savedTheme: null, prefersDark: true, throwOnLocalStorage: true });
  assert.doesNotThrow(() => {
    vm.runInContext(foucScript, sandbox);
  }, 'FOUC script must not throw when localStorage access is restricted');
  assert.ok(documentElement.classList.contains('dark'), 'documentElement must still get dark class from prefersDark fallback');
});

// 8. Theme Toggle Script Extraction
const toggleScript = extractToggleScript(htmlContent);
runTestCase('CHALLENGE-08', 'ThemeToggle interactive script presence', () => {
  assert.ok(toggleScript !== null, 'ThemeToggle script must be present in HTML');
  assert.ok(toggleScript.includes('theme-toggle'), 'Toggle script must reference theme-toggle button ID');
  assert.ok(toggleScript.includes('aria-pressed'), 'Toggle script must update aria-pressed attribute');
});

// 9. Interactive Toggle - Light to Dark
runTestCase('CHALLENGE-09', 'Interactive ThemeToggle: Light -> Dark switch and localStorage persistence', () => {
  const { sandbox, documentElement, toggleBtn, localStorageStore } = createMockEnvironment({ savedTheme: 'light', prefersDark: false });
  vm.runInContext(toggleScript, sandbox);
  
  // Initial state: light
  assert.ok(!documentElement.classList.contains('dark'));
  
  // User clicks theme toggle
  toggleBtn.click();
  
  // Verified state: dark
  assert.ok(documentElement.classList.contains('dark'), 'documentElement class must contain "dark" after click');
  assert.equal(localStorageStore['theme'], 'dark', 'localStorage theme must be updated to "dark"');
  assert.equal(toggleBtn.getAttribute('aria-pressed'), 'true', 'aria-pressed must be set to "true"');
});

// 10. Interactive Toggle - Dark to Light
runTestCase('CHALLENGE-10', 'Interactive ThemeToggle: Dark -> Light switch and localStorage persistence', () => {
  const { sandbox, documentElement, toggleBtn, localStorageStore } = createMockEnvironment({ savedTheme: 'dark', prefersDark: true });
  // Pre-set dark class
  documentElement.classList.add('dark');
  vm.runInContext(toggleScript, sandbox);
  
  // User clicks theme toggle
  toggleBtn.click();
  
  // Verified state: light
  assert.ok(!documentElement.classList.contains('dark'), 'documentElement class must lose "dark" after click');
  assert.equal(localStorageStore['theme'], 'light', 'localStorage theme must be updated to "light"');
  assert.equal(toggleBtn.getAttribute('aria-pressed'), 'false', 'aria-pressed must be set to "false"');
});

// 11. Interactive Toggle - LocalStorage setItem Exception Resilience
runTestCase('CHALLENGE-11', 'Interactive ThemeToggle: Handles localStorage.setItem exception gracefully', () => {
  const { sandbox, documentElement, toggleBtn } = createMockEnvironment({ savedTheme: null, prefersDark: false, throwOnLocalStorage: true });
  vm.runInContext(toggleScript, sandbox);
  
  assert.doesNotThrow(() => {
    toggleBtn.click();
  }, 'Clicking toggle button must not throw error when localStorage.setItem fails');
  
  assert.ok(documentElement.classList.contains('dark'), 'Theme must still toggle in DOM state even if storage write fails');
  assert.equal(toggleBtn.getAttribute('aria-pressed'), 'true', 'aria-pressed must still update even if storage write fails');
});

// 12. FOUC Script Location in <head>
runTestCase('CHALLENGE-12', 'FOUC inline script is placed synchronously inside <head>', () => {
  const headEndIdx = htmlContent.indexOf('</head>');
  const bodyStartIdx = htmlContent.indexOf('<body');
  assert.ok(headEndIdx !== -1 && bodyStartIdx !== -1, 'HTML must contain <head> and <body> tags');
  assert.ok(headEndIdx < bodyStartIdx, '<head> must come before <body>');
  
  const foucScriptIdx = htmlContent.indexOf('var savedTheme = localStorage.getItem');
  assert.ok(foucScriptIdx !== -1, 'FOUC script body must exist in HTML');
  assert.ok(foucScriptIdx < headEndIdx, 'FOUC script MUST be located inside <head> section to block rendering before FOUC');
});

// 13. Responsive 1-3 Column Grid Layout Contract
runTestCase('CHALLENGE-13', 'Responsive grid contract (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)', () => {
  // Check dist/index.html or source Astro pages
  const gridClassRegex = /class="[^"]*grid-cols-1[^"]*md:grid-cols-2[^"]*lg:grid-cols-3[^"]*"/;
  const matches = gridClassRegex.test(htmlContent);
  assert.ok(matches, 'Projects grid container in dist/index.html must specify grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
});

// 14. Responsive Grid Child Project Cards Count
runTestCase('CHALLENGE-14', 'Project cards grid renders 6 project cards inside responsive container', () => {
  const articleMatches = htmlContent.match(/<article[\s\S]*?<\/article>/gi) || [];
  assert.equal(articleMatches.length, 6, `Expected exactly 6 project card articles in layout grid, found ${articleMatches.length}`);
});

console.log('\n====================================================');
console.log(` SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${passCount + failCount} tests`);
console.log('====================================================\n');

if (failCount > 0) {
  process.exit(1);
}
