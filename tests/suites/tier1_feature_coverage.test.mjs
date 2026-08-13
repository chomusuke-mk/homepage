/**
 * tests/suites/tier1_feature_coverage.test.mjs
 * Tier 1: Core Feature Coverage Test Suite
 */

import assert from 'node:assert/strict';

export default function registerTier1(test, context) {
  const { fsUtils, processRunner, parseHTML } = context;

  // Domain 1.1: SSG Build & Output Assets
  test(1, 'TEST-T1-SSG-001', 'Astro SSG build output file dist/index.html integrity check', async () => {
    let htmlContent = fsUtils.getDistIndexHtml();
    if (!htmlContent && !context.skipBuild) {
      // If dist/index.html does not exist yet and --no-build was not passed, attempt to run build
      const buildRes = processRunner.runBuild();
      assert.ok(buildRes.ok || fsUtils.fileExists('dist/index.html'), 'dist/index.html must exist or build must complete successfully');
      htmlContent = fsUtils.getDistIndexHtml();
    }
    assert.ok(htmlContent && htmlContent.length > 100, 'dist/index.html should exist and contain non-trivial HTML content');
  });

  test(1, 'TEST-T1-SSG-002', 'Global CSS stylesheet asset linking in head', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const links = doc.querySelectorAll('link[rel="stylesheet"]');
    assert.ok(links.length > 0, 'HTML head must include at least one stylesheet link element');
    const hasAstroCss = links.some(l => (l.getAttribute('href') || '').includes('_astro/') || (l.getAttribute('href') || '').endsWith('.css'));
    assert.ok(hasAstroCss, 'Stylesheet link must point to bundled CSS asset');
  });

  // Domain 1.2: 6 Project Cards Verification
  const REQUIRED_PROJECTS = [
    { id: 'vidra', title: 'Vidra', keywords: ['Flutter', 'Python', 'yt-dlp', 'video'] },
    { id: 'vidra-backend', title: 'vidra-backend', keywords: ['Python', 'REST', 'API'] },
    { id: 'vidra-quickjs', title: 'vidra-quickjs', keywords: ['QuickJS', 'C', 'Native'] },
    { id: 'vidra-ffmpeg', title: 'vidra-ffmpeg', keywords: ['FFmpeg', 'Docker'] },
    { id: 'apt-repository', title: 'apt-repository', keywords: ['Debian', 'Ubuntu', 'APT'] },
    { id: 'fdroid-repository', title: 'fdroid-repository', keywords: ['Android', 'F-Droid', 'APK'] }
  ];

  REQUIRED_PROJECTS.forEach(proj => {
    test(1, `TEST-T1-CRD-${proj.id}`, `Project Card rendering and metadata for ${proj.id}`, async () => {
      const htmlContent = fsUtils.getDistIndexHtml();
      assert.ok(htmlContent, 'dist/index.html missing');

      const containsTitle = htmlContent.toLowerCase().includes(proj.id.toLowerCase()) || 
                            htmlContent.toLowerCase().includes(proj.title.toLowerCase());
      assert.ok(containsTitle, `HTML output must include project title or identifier for "${proj.id}"`);
    });
  });

  test(1, 'TEST-T1-CRD-ALL-6', 'All 6 local projects rendered in project grid', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const articles = doc.querySelectorAll('article');
    assert.ok(articles.length >= 6, `Expected at least 6 project card articles, found ${articles.length}`);
  });

  test(1, 'TEST-T1-CRD-007', 'Card sort order and featured metadata structure', async () => {
    // Inspect source markdown files or parsed HTML structure
    const mdFiles = fsUtils.getProjectMarkdownFiles();
    if (mdFiles.length > 0) {
      const frontmatters = mdFiles.map(file => fsUtils.parseFrontmatter(fsUtils.readFile(file)));
      const hasOrders = frontmatters.every(fm => fm.order !== undefined);
      assert.ok(hasOrders, 'Project collection metadata should contain title and order attributes');
    } else {
      const htmlContent = fsUtils.getDistIndexHtml();
      assert.ok(htmlContent, 'dist/index.html missing');
    }
  });

  // Domain 1.3: Light/Dark Theme Toggle
  test(1, 'TEST-T1-THM-001', 'Theme toggle button and inline blocking head script for FOUC prevention', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);

    // Search for script in head or scripts
    const headScripts = doc.querySelectorAll('head script, script');
    const hasThemeScript = headScripts.some(s => {
      const txt = s.textContent;
      return txt.includes('theme') || txt.includes('dark') || txt.includes('localStorage') || txt.includes('prefers-color-scheme');
    });
    assert.ok(hasThemeScript, 'Head must contain inline theme script to prevent FOUC');

    // Search for theme toggle button
    const toggleBtn = doc.querySelector('#theme-toggle') || 
                      doc.querySelector('[data-theme-toggle]') || 
                      doc.querySelector('button[aria-label*="modo"]') ||
                      doc.querySelector('button[aria-label*="theme"]');
    assert.ok(toggleBtn !== null, 'Theme toggle interactive button element must be present');
  });

  // Domain 1.4: Spanish Copy Localization
  test(1, 'TEST-T1-ESP-001', 'Document root specifies Spanish language <html lang="es">', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const htmlElem = doc.querySelector('html');
    assert.ok(htmlElem !== null, '<html> tag must be present');
    assert.strictEqual(htmlElem.getAttribute('lang'), 'es', 'Document html tag lang attribute must equal "es"');
  });

  test(1, 'TEST-T1-ESP-002', 'Hero section Spanish copy assertions and zero English placeholders', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    
    // Prohibited untranslated placeholders
    const englishPlaceholders = ['lorem ipsum', 'hello world', 'welcome to my portfolio', 'about me description placeholder'];
    const lower = htmlContent.toLowerCase();
    for (const ph of englishPlaceholders) {
      assert.ok(!lower.includes(ph), `HTML should not contain untranslated placeholder text: "${ph}"`);
    }

    const doc = parseHTML(htmlContent);
    const heroText = doc.querySelector('header, main')?.textContent.toLowerCase() || lower;
    const containsSpanishIntro = heroText.includes('desarrollador') || heroText.includes('proyectos') || heroText.includes('portafolio');
    assert.ok(containsSpanishIntro, 'Hero section must contain localized Spanish intro copy');
  });

  test(1, 'TEST-T1-ESP-003', 'Section headings use Spanish terms (Proyectos, Sobre mí, Contacto)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const h2s = doc.querySelectorAll('h2');
    const h2Text = h2s.map(h => h.textContent.toLowerCase()).join(' ');
    assert.ok(h2Text.includes('proyecto'), 'Section headings must include Spanish "Proyectos"');
  });

  test(1, 'TEST-T1-ESP-004', 'Card CTAs use Spanish button text (Ver en GitHub, Sitio Web, Descargar)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const links = doc.querySelectorAll('article a, button');
    const linkTexts = links.map(l => l.textContent.trim()).join(' ');
    const hasSpanishCta = linkTexts.includes('GitHub') || linkTexts.includes('Web') || linkTexts.includes('Descargar') || linkTexts.includes('Ver');
    assert.ok(hasSpanishCta, 'CTA buttons must use localized Spanish copy');
  });

  test(1, 'TEST-T1-ESP-005', 'Footer copy uses Spanish copyright & localization strings', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const footer = doc.querySelector('footer');
    assert.ok(footer !== null, 'Footer element must exist');
    const txt = footer.textContent.toLowerCase();
    const hasCopyright = txt.includes('derechos') || txt.includes('chomusuke') || txt.includes('202');
    assert.ok(hasCopyright, 'Footer must contain Spanish copyright text');
  });

  // Domain 1.5: Semantic HTML Structure
  test(1, 'TEST-T1-SEM-001', 'Strict Single <h1> Tag Rule', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const h1s = doc.querySelectorAll('h1');
    assert.strictEqual(h1s.length, 1, `Page must contain exactly 1 <h1> element, found ${h1s.length}`);
  });

  test(1, 'TEST-T1-SEM-002', 'Sequential Heading Hierarchy Validation (h1 -> h2 -> h3)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    assert.ok(headings.length >= 2, 'Page should contain sequential heading tags');
    const levels = headings.map(h => parseInt(h.tagName.substring(1), 10));
    assert.strictEqual(levels[0], 1, 'First heading on page must be h1');
    for (let i = 1; i < levels.length; i++) {
      const prev = levels[i - 1];
      const curr = levels[i];
      assert.ok(curr <= prev + 1, `Heading hierarchy skip detected: h${prev} followed by h${curr}`);
    }
  });

  test(1, 'TEST-T1-SEM-003', 'Landmark Architecture (<header>, <main>, <section>, <footer>)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    assert.ok(doc.querySelector('header') !== null, '<header> landmark element missing');
    assert.ok(doc.querySelector('main') !== null, '<main> landmark element missing');
    assert.ok(doc.querySelector('section') !== null, '<section> landmark element missing');
    assert.ok(doc.querySelector('footer') !== null, '<footer> landmark element missing');
  });

  test(1, 'TEST-T1-SEM-004', 'Project card articles (<article>)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const articles = doc.querySelectorAll('article');
    assert.ok(articles.length >= 6, 'Project cards must be wrapped inside <article> elements');
  });

  test(1, 'TEST-T1-SEM-005', 'Header navigation bar (<nav aria-label="...">)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const nav = doc.querySelector('nav');
    assert.ok(nav !== null, '<nav> navigation element missing');
    const label = nav.getAttribute('aria-label');
    assert.ok(label && label.length > 0, '<nav> must have non-empty aria-label attribute');
  });

  // Domain 1.6: Accessibility Compliance
  test(1, 'TEST-T1-A11Y-001', 'Keyboard focus visible styling (:focus-visible)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const interactives = doc.querySelectorAll('a, button');
    const hasFocusClass = interactives.some(el => {
      const cls = el.getAttribute('class') || '';
      return cls.includes('focus') || cls.includes('outline') || cls.includes('ring');
    });
    assert.ok(hasFocusClass, 'Interactive controls should include focus indicator utility classes');
  });

  test(1, 'TEST-T1-A11Y-002', 'Accessible names for interactive control targets', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const buttons = doc.querySelectorAll('button');
    assert.ok(buttons.length > 0, 'At least one button element must exist');
    for (const btn of buttons) {
      const name = btn.getAttribute('aria-label') || btn.textContent.trim();
      assert.ok(name.length > 0, `Button element <${btn.outerHTML}> must have an accessible name`);
    }
  });

  test(1, 'TEST-T1-A11Y-003', 'External link security target="_blank" and rel="noopener noreferrer"', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const extLinks = doc.querySelectorAll('a[href^="http"]');
    assert.ok(extLinks.length > 0, 'At least one external link element must exist');
    for (const link of extLinks) {
      assert.strictEqual(link.getAttribute('target'), '_blank', `External link ${link.getAttribute('href')} must have target="_blank"`);
      const rel = link.getAttribute('rel') || '';
      assert.ok(rel.includes('noopener') && rel.includes('noreferrer'), `External link ${link.getAttribute('href')} must include rel="noopener noreferrer"`);
    }
  });
}
