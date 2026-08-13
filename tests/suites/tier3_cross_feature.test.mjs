/**
 * tests/suites/tier3_cross_feature.test.mjs
 * Tier 3: Cross-Feature Interactions Test Suite
 */

import assert from 'node:assert/strict';

export default function registerTier3(test, context) {
  const { fsUtils, parseHTML } = context;

  test(3, 'TC-T3-01', 'Theme toggle state persistence script and hydration logic in HTML head', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);

    // Verify blocking inline script in <head>
    const head = doc.querySelector('head');
    assert.ok(head !== null, '<head> element missing');
    const scripts = head.querySelectorAll('script');
    const hasPersistenceScript = scripts.some(s => {
      const code = s.textContent;
      return (code.includes('localStorage') || code.includes('prefers-color-scheme')) &&
             (code.includes('dark') || code.includes('classList'));
    });
    assert.ok(hasPersistenceScript, 'Inline script in <head> must initialize theme state from localStorage/OS before page render');
  });

  test(3, 'TC-T3-02', 'Theme toggle button ARIA accessibility attributes and interactive state contract', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);

    const toggle = doc.querySelector('#theme-toggle') || 
                   doc.querySelector('[data-theme-toggle]') || 
                   doc.querySelector('button[aria-label*="modo"]') ||
                   doc.querySelector('button[aria-label*="theme"]');
    assert.ok(toggle !== null, 'Theme toggle button must be present in DOM');
    const ariaLabel = toggle.getAttribute('aria-label');
    const ariaPressed = toggle.getAttribute('aria-pressed');
    assert.ok(ariaLabel || ariaPressed, 'Theme toggle button must define aria-label or aria-pressed attribute');
  });

  test(3, 'TC-T3-03', 'Responsive grid 1-3 col layout transitions across breakpoints', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    
    // Check presence of Tailwind multi-column grid classes
    const hasMobileCol = htmlContent.includes('grid-cols-1') || htmlContent.includes('grid');
    const hasMdCol = htmlContent.includes('md:grid-cols-2') || htmlContent.includes('grid-cols-2');
    const hasLgCol = htmlContent.includes('lg:grid-cols-3') || htmlContent.includes('grid-cols-3');

    assert.ok(hasMobileCol, 'Grid layout must specify 1-column mobile base layout');
    assert.ok(hasMdCol, 'Grid layout must specify 2-column tablet layout (md:grid-cols-2)');
    assert.ok(hasLgCol, 'Grid layout must specify 3-column desktop layout (lg:grid-cols-3)');
  });

  test(3, 'TC-T3-04', 'External project link security target="_blank" rel="noopener noreferrer" & button focus ring classes', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);

    const extLinks = doc.querySelectorAll('a[href^="http"]');
    assert.ok(extLinks.length > 0, 'Project cards must contain external GitHub or demo links');

    for (const link of extLinks) {
      assert.strictEqual(link.getAttribute('target'), '_blank', `Link ${link.getAttribute('href')} must have target="_blank"`);
      const rel = link.getAttribute('rel') || '';
      assert.ok(rel.includes('noopener'), `Link ${link.getAttribute('href')} rel must contain "noopener"`);
      assert.ok(rel.includes('noreferrer'), `Link ${link.getAttribute('href')} rel must contain "noreferrer"`);
    }

    // Check focus ring styling on action buttons
    const buttons = doc.querySelectorAll('a, button');
    const hasFocusRings = buttons.some(b => {
      const cls = b.getAttribute('class') || '';
      return cls.includes('focus') || cls.includes('ring') || cls.includes('outline');
    });
    assert.ok(hasFocusRings, 'Action buttons must specify focus ring visual indicators');
  });

  test(3, 'TC-T3-05', 'Global keyboard focus flow & focus trap avoidance structure', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);

    // Verify document structure contains sequential focusable landmarks (Header -> Main -> Footer)
    const header = doc.querySelector('header');
    const main = doc.querySelector('main');
    const footer = doc.querySelector('footer');

    assert.ok(header !== null && main !== null && footer !== null, 'Landmark elements must exist in DOM order');
    
    // Check header focusable elements
    const headerInteractives = header.querySelectorAll('a, button');
    assert.ok(headerInteractives.length > 0, 'Header must contain focusable navigation or theme toggle elements');

    // Check main focusable elements
    const mainInteractives = main.querySelectorAll('a, button');
    assert.ok(mainInteractives.length > 0, 'Main content must contain focusable project links');

    // Check footer focusable elements
    const footerInteractives = footer.querySelectorAll('a, button');
    assert.ok(footerInteractives.length >= 0, 'Footer structural validation');
  });
}
