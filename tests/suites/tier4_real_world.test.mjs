/**
 * tests/suites/tier4_real_world.test.mjs
 * Tier 4: Real-World Application Scenarios Test Suite
 */

import assert from 'node:assert/strict';

export default function registerTier4(test, context) {
  const { fsUtils, processRunner, parseHTML } = context;

  test(4, 'TC-T4-01', 'Production build execution (pnpm run build)', async () => {
    assert.ok(fsUtils.fileExists('package.json'), 'package.json must exist in project root');
    const result = processRunner.runBuild();
    assert.strictEqual(result.code, 0, `pnpm run build failed with exit code ${result.code}: ${result.stderr}`);
    assert.ok(fsUtils.fileExists('dist/index.html'), 'dist/index.html must exist after build execution');
  });

  test(4, 'TC-T4-02', 'Static dist/ directory integrity & 6 project titles pre-rendered in HTML', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent && htmlContent.length > 0, 'dist/index.html must exist and contain generated HTML markup');

    // Verify all 6 project titles
    const projects = ['vidra', 'vidra-backend', 'vidra-quickjs', 'vidra-ffmpeg', 'apt-repository', 'fdroid-repository'];
    const lower = htmlContent.toLowerCase();

    for (const proj of projects) {
      assert.ok(lower.includes(proj), `Pre-rendered HTML dist/index.html must include project identifier: "${proj}"`);
    }

    // Verify landmark tags
    const doc = parseHTML(htmlContent);
    assert.ok(doc.querySelector('header') !== null, '<header> tag missing in static output');
    assert.ok(doc.querySelector('main') !== null, '<main> tag missing in static output');
    assert.ok(doc.querySelector('footer') !== null, '<footer> tag missing in static output');
  });

  test(4, 'TC-T4-03', 'Astro & TypeScript static type validation (pnpm run check)', async () => {
    assert.ok(fsUtils.fileExists('package.json'), 'package.json must exist in project root');
    const result = processRunner.runCheck();
    assert.strictEqual(result.code, 0, `pnpm run check failed with exit code ${result.code}: ${result.stderr}`);
  });

  test(4, 'TC-T4-04', 'Linter execution & code quality check (pnpm run lint)', async () => {
    assert.ok(fsUtils.fileExists('package.json'), 'package.json must exist in project root');
    const result = processRunner.runLint();
    assert.strictEqual(result.code, 0, `pnpm run lint failed with exit code ${result.code}: ${result.stderr}`);
  });
}
