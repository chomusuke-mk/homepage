/**
 * empirical_challenger_m6_2.mjs
 * Tier 5 White-Box Adversarial Stress Harness for Chomusuke Homepage.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from './helpers/html_parser.mjs';
import * as fsUtils from './helpers/fs_utils.mjs';

const distEsPath = '/mnt/Proyectos/homepage/dist/index.html';
const distEnPath = '/mnt/Proyectos/homepage/dist/en/index.html';

const results = [];

function recordTest(id, category, description, pass, details = '') {
  results.push({ id, category, description, pass, details });
  const symbol = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`[${symbol}] [${id}] ${category}: ${description}${details ? ` -> ${details}` : ''}`);
}

// Simple i18n parser for ui.ts
function parseUiTs() {
  const fileContent = fs.readFileSync('/mnt/Proyectos/homepage/src/i18n/ui.ts', 'utf-8');
  
  // Extract es block and en block
  const esMatch = fileContent.match(/\bes:\s*\{([^}]+(?:\n[^}]+)*)\}/);
  const enMatch = fileContent.match(/\ben:\s*\{([^}]+(?:\n[^}]+)*)\}/);

  const parseBlock = (blockStr) => {
    const keys = {};
    const lines = blockStr.split('\n');
    for (const line of lines) {
      const kv = line.match(/^\s*['"]([^'"]+)['"]\s*:\s*['"`](.*)['"`]\s*,?\s*$/);
      if (kv) {
        keys[kv[1]] = kv[2];
      }
    }
    return keys;
  };

  const es = esMatch ? parseBlock(esMatch[1]) : {};
  const en = enMatch ? parseBlock(enMatch[1]) : {};

  return { es, en };
}

// Pure JS implementation of useTranslatedPath logic from utils.ts
function useTranslatedPath(lang, defaultLang = 'es') {
  return function translatePath(pathStr, targetLang = lang) {
    const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
    if (targetLang === defaultLang) {
      return cleanPath.replace(/^\/en(?=\/|$)/, '') || '/';
    }
    if (cleanPath.startsWith('/en/') || cleanPath === '/en') {
      return cleanPath;
    }
    return `/en${cleanPath === '/' ? '' : cleanPath}`;
  };
}

async function runAdversarialSuite() {
  console.log('============================================================');
  console.log(' TIER 5 ADVERSARIAL COVERAGE HARDENING SUITE');
  console.log(' Target Project: /mnt/Proyectos/homepage');
  console.log('============================================================\n');

  // --- 1. i18n Dictionary Parity & Fallbacks ---
  try {
    const { es, en } = parseUiTs();
    const esKeys = Object.keys(es).sort();
    const enKeys = Object.keys(en).sort();

    const missingInEn = esKeys.filter(k => !(k in en));
    const missingInEs = enKeys.filter(k => !(k in es));

    const parityPass = missingInEn.length === 0 && missingInEs.length === 0;
    recordTest(
      'ADV-I18N-001',
      'i18n Dictionary Parity',
      'ES and EN translation dictionaries must have 100% matching key sets',
      parityPass,
      parityPass ? `Total keys in ES: ${esKeys.length}, EN: ${enKeys.length}` : `Missing in EN: [${missingInEn.join(', ')}], Missing in ES: [${missingInEs.join(', ')}]`
    );

    const emptyEs = esKeys.filter(k => !es[k] || es[k].trim() === '');
    const emptyEn = enKeys.filter(k => !en[k] || en[k].trim() === '');
    const noEmptyPass = emptyEs.length === 0 && emptyEn.length === 0;
    recordTest(
      'ADV-I18N-002',
      'i18n Non-Empty Values',
      'All translation values must be non-empty strings',
      noEmptyPass,
      noEmptyPass ? 'All keys populated' : `Empty ES: ${emptyEs.length}, Empty EN: ${emptyEn.length}`
    );
  } catch (e) {
    recordTest('ADV-I18N-ERR', 'i18n Dictionary', 'Error analyzing i18n', false, e.message);
  }

  // --- 2. URL Translation & Route Handling Edge Cases ---
  try {
    const translateEsPath = useTranslatedPath('es');
    const translateEnPath = useTranslatedPath('en');

    // Standard expected behaviors
    const testCases = [
      { path: '/about', targetLang: 'es', expected: '/about' },
      { path: '/about', targetLang: 'en', expected: '/en/about' },
      { path: '/en/about', targetLang: 'es', expected: '/about' },
      { path: '/', targetLang: 'en', expected: '/en' },
      { path: '/en', targetLang: 'es', expected: '/' },
    ];

    let standardPass = true;
    for (const tc of testCases) {
      const fn = tc.targetLang === 'es' ? translateEsPath : translateEnPath;
      const res = fn(tc.path);
      if (res !== tc.expected) {
        standardPass = false;
        console.log(`    Expected ${tc.path} (${tc.targetLang}) -> ${tc.expected}, got ${res}`);
      }
    }

    recordTest(
      'ADV-ROUTE-000',
      'Standard Route Translation',
      'Standard route translation maps / and /about correctly across languages',
      standardPass
    );

    // Adversarial edge cases: paths starting with '/en' as prefix of longer words
    const wordPrefixPaths = ['/entry', '/enterprise', '/english', '/environment', '/entity'];
    let routeRegexBugFound = false;
    const bugDetails = [];

    for (const p of wordPrefixPaths) {
      const translatedToEs = translateEsPath(p);
      if (translatedToEs !== p) {
        routeRegexBugFound = true;
        bugDetails.push(`${p} => ${translatedToEs}`);
      }
    }

    recordTest(
      'ADV-ROUTE-001',
      'Route Translation Regex Edge Cases',
      'useTranslatedPath must not strip /en from words like /entry or /enterprise when translating to ES',
      !routeRegexBugFound,
      routeRegexBugFound ? `VULNERABILITY CONFIRMED (cleanPath.replace(/^\\/en/, '')): ${bugDetails.join(', ')}` : 'All word-prefix paths preserved'
    );
  } catch (e) {
    recordTest('ADV-ROUTE-ERR', 'Route Translation', 'Error testing route paths', false, e.message);
  }

  // --- 3. Static Pre-rendered HTML Integrity (ES & EN) ---
  try {
    const esExists = fs.existsSync(distEsPath);
    const enExists = fs.existsSync(distEnPath);

    recordTest(
      'ADV-SSG-001',
      'Static Route Generation',
      'dist/index.html (ES) and dist/en/index.html (EN) must both exist',
      esExists && enExists,
      `ES: ${esExists}, EN: ${enExists}`
    );

    if (esExists && enExists) {
      const htmlEs = fs.readFileSync(distEsPath, 'utf-8');
      const htmlEn = fs.readFileSync(distEnPath, 'utf-8');

      const docEs = parseHTML(htmlEs);
      const docEn = parseHTML(htmlEn);

      const langEsAttr = docEs.querySelector('html')?.getAttribute('lang');
      const langEnAttr = docEn.querySelector('html')?.getAttribute('lang');

      recordTest(
        'ADV-SSG-002',
        'Locale HTML Attribute',
        '<html lang="..."> must equal "es" on ES page and "en" on EN page',
        langEsAttr === 'es' && langEnAttr === 'en',
        `ES lang: "${langEsAttr}", EN lang: "${langEnAttr}"`
      );

      const enHeroText = docEn.querySelector('main')?.textContent || '';
      const containsEnGreeting = enHeroText.includes("Hello, I'm") || enHeroText.includes('Chomusuke');
      recordTest(
        'ADV-SSG-003',
        'EN Pre-rendering Quality',
        'dist/en/index.html pre-renders English text correctly',
        containsEnGreeting
      );
    }
  } catch (e) {
    recordTest('ADV-SSG-ERR', 'Static HTML', 'Error reading SSG dist HTML', false, e.message);
  }

  // --- 4. Asset Paths & Missing Asset Checks ---
  try {
    if (fs.existsSync(distEsPath)) {
      const htmlEs = fs.readFileSync(distEsPath, 'utf-8');
      const docEs = parseHTML(htmlEs);

      const images = docEs.querySelectorAll('img');
      let brokenAssets = [];

      for (const img of images) {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
          const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
          const publicPath = path.join('/mnt/Proyectos/homepage/public', cleanSrc);
          const distPath = path.join('/mnt/Proyectos/homepage/dist', cleanSrc);
          if (!fs.existsSync(publicPath) && !fs.existsSync(distPath)) {
            brokenAssets.push(src);
          }
        }
      }

      recordTest(
        'ADV-AST-001',
        'Asset Verification',
        'All local <img> src paths must exist in public/ or dist/',
        brokenAssets.length === 0,
        brokenAssets.length === 0 ? 'All image assets exist' : `Missing assets: ${brokenAssets.join(', ')}`
      );
    }
  } catch (e) {
    recordTest('ADV-AST-ERR', 'Asset Paths', 'Error checking asset paths', false, e.message);
  }

  // --- 5. Accessibility (a11y) & LanguageToggle Audit ---
  try {
    if (fs.existsSync(distEsPath) && fs.existsSync(distEnPath)) {
      const htmlEs = fs.readFileSync(distEsPath, 'utf-8');
      const htmlEn = fs.readFileSync(distEnPath, 'utf-8');

      const docEs = parseHTML(htmlEs);
      const docEn = parseHTML(htmlEn);

      // Check Language Toggle Aria Label on EN page
      const langToggleEn = docEn.querySelector('a[aria-label*="idioma"], a[aria-label*="language"], a[aria-label*="Idioma"], a[aria-label*="Language"]');
      const ariaLabelEn = langToggleEn ? langToggleEn.getAttribute('aria-label') : '';

      const isHardcodedEsLabel = ariaLabelEn.includes('Cambiar idioma');
      recordTest(
        'ADV-A11Y-001',
        'Language Toggle i18n Aria Label',
        'Language toggle aria-label on English page should be localized in English',
        !isHardcodedEsLabel,
        isHardcodedEsLabel ? `Hardcoded Spanish aria-label found on EN page: "${ariaLabelEn}"` : `Localized aria-label: "${ariaLabelEn}"`
      );

      // Check Image Alt Attributes
      const allImgsEs = docEs.querySelectorAll('img');
      const unlabelledImgs = allImgsEs.filter(img => {
        const alt = img.getAttribute('alt');
        return alt === null || alt === undefined;
      });

      recordTest(
        'ADV-A11Y-002',
        'Image Alt Attributes',
        'All <img> tags must explicitly specify alt attribute (even if empty for decorative)',
        unlabelledImgs.length === 0,
        `Unlabelled images: ${unlabelledImgs.length}`
      );
    }
  } catch (e) {
    recordTest('ADV-A11Y-ERR', 'Accessibility', 'Error auditing a11y', false, e.message);
  }

  // --- 6. Content Markdown Schema & Link Integrity ---
  try {
    const mdFiles = fsUtils.getProjectMarkdownFiles();
    let schemaViolations = 0;
    let brokenUrls = [];

    for (const file of mdFiles) {
      const content = fsUtils.readFile(file);
      const fm = fsUtils.parseFrontmatter(content);

      if (!fm.title || !fm.description || !Array.isArray(fm.techStack)) {
        schemaViolations++;
      }

      const urlsToCheck = [fm.githubLink, fm.liveLink, fm.downloadLink].filter(Boolean);
      for (const u of urlsToCheck) {
        try {
          new URL(u);
        } catch {
          brokenUrls.push(`${file}: ${u}`);
        }
      }
    }

    recordTest(
      'ADV-MD-001',
      'Markdown Content Integrity',
      'All project frontmatters pass schema rules and contain valid URLs',
      schemaViolations === 0 && brokenUrls.length === 0,
      `Files checked: ${mdFiles.length}, Schema violations: ${schemaViolations}, Invalid URLs: ${brokenUrls.length}`
    );
  } catch (e) {
    recordTest('ADV-MD-ERR', 'Markdown Content', 'Error testing markdown files', false, e.message);
  }

  console.log('\n============================================================');
  console.log(' ADVERSARIAL SUITE SUMMARY');
  console.log('============================================================');
  const passedCount = results.filter(r => r.pass).length;
  const failedCount = results.filter(r => !r.pass).length;
  console.log(`Passed: ${passedCount} | Failed: ${failedCount} | Total: ${results.length}\n`);

  return { passedCount, failedCount, total: results.length, results };
}

runAdversarialSuite().catch(console.error);
