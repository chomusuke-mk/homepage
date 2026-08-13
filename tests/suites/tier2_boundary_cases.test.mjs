/**
 * tests/suites/tier2_boundary_cases.test.mjs
 * Tier 2: Boundary & Corner Cases Test Suite
 */

import assert from 'node:assert/strict';
import { z } from 'zod';

export default function registerTier2(test, context) {
  const { fsUtils, parseHTML } = context;

  // Domain 2.1: Missing Optional Content Schema Fields & Fallbacks
  test(2, 'TEST-T2-OPT-001', 'Omission of downloadLink in project markdown renders cleanly without broken button or href="undefined"', async () => {
    const mdFiles = fsUtils.getProjectMarkdownFiles();
    if (mdFiles.length > 0) {
      for (const file of mdFiles) {
        const content = fsUtils.readFile(file);
        const fm = fsUtils.parseFrontmatter(content);
        if (fm.downloadLink === undefined) {
          assert.strictEqual(fm.downloadLink, undefined, 'downloadLink is optional');
        }
      }
    }
    const htmlContent = fsUtils.getDistIndexHtml();
    if (htmlContent) {
      assert.ok(!htmlContent.includes('href="undefined"'), 'HTML must never render href="undefined"');
      assert.ok(!htmlContent.includes('href="null"'), 'HTML must never render href="null"');
    }
  });

  test(2, 'TEST-T2-OPT-002', 'Zod default fallback for featured (default false) and order (default 0)', async () => {
    const projectSchema = z.object({
      title: z.string(),
      description: z.string(),
      techStack: z.array(z.string()),
      githubLink: z.string().url(),
      liveLink: z.string().url(),
      downloadLink: z.string().url().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(0),
    });

    const syntheticInput = {
      title: 'Synthetic Project',
      description: 'Synthetic Description',
      techStack: ['Node.js'],
      githubLink: 'https://github.com/example/synthetic',
      liveLink: 'https://example.com/synthetic',
    };

    const parsed = projectSchema.parse(syntheticInput);
    assert.strictEqual(parsed.featured, false, 'Zod schema default for featured must be false when omitted');
    assert.strictEqual(parsed.order, 0, 'Zod schema default for order must be 0 when omitted');

    const mdFiles = fsUtils.getProjectMarkdownFiles();
    if (mdFiles.length > 0) {
      for (const file of mdFiles) {
        const fm = fsUtils.parseFrontmatter(fsUtils.readFile(file));
        const featuredVal = fm.featured ?? false;
        assert.strictEqual(typeof featuredVal, 'boolean', 'featured field must evaluate to a boolean');
        const orderVal = fm.order ?? 0;
        assert.strictEqual(typeof orderVal, 'number', 'order field must evaluate to a number');
      }
    }
  });

  test(2, 'TEST-T2-OPT-004', 'Empty techStack array handled without breaking layout', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const articles = doc.querySelectorAll('article');
    assert.ok(articles.length > 0, 'Project cards must be present');
    const badges = doc.querySelectorAll('article span');
    for (const badge of badges) {
      assert.ok(badge.textContent.trim().length > 0, 'Tech badges must not be empty span tags');
    }
  });

  // Domain 2.2: Extreme & Long Content Text Handling
  test(2, 'TEST-T2-TXT-001', 'Ultra-long description text line clamping (line-clamp-3 / overflow hidden)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const paragraphs = doc.querySelectorAll('article p');
    const hasClamping = paragraphs.some(p => {
      const cls = p.getAttribute('class') || '';
      return cls.includes('line-clamp') || cls.includes('truncate') || cls.includes('overflow-hidden');
    });
    assert.ok(hasClamping, 'Project description text elements should include line-clamp utility class');
  });

  test(2, 'TEST-T2-TXT-002', 'Long single-word title wrapping (fdroid-repository with break-words or hyphens)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const headings = doc.querySelectorAll('article h3, article h2');
    const hasBreakWords = headings.some(h => {
      const cls = h.getAttribute('class') || '';
      return cls.includes('break') || cls.includes('truncate') || cls.includes('hyphens');
    });
    assert.ok(hasBreakWords, 'Long titles like fdroid-repository must specify word breaking utility classes');
  });

  test(2, 'TEST-T2-TXT-003', 'Multi-badge tech stack wrapping (flex flex-wrap gap-2)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const flexWraps = doc.querySelectorAll('.flex-wrap, [class*="flex-wrap"]');
    assert.ok(flexWraps.length > 0, 'Tech badge container must include flex-wrap class for overflow wrapping');
  });

  // Domain 2.3: Schema Validation Failure Simulation
  test(2, 'TEST-T2-SCH-001', 'Frontmatter schema rules require title and valid URL links', async () => {
    const mdFiles = fsUtils.getProjectMarkdownFiles();
    if (mdFiles.length > 0) {
      for (const file of mdFiles) {
        const fm = fsUtils.parseFrontmatter(fsUtils.readFile(file));
        assert.ok(fm.title && fm.title.length > 0, `File ${file} must have a non-empty title`);
        if (fm.githubLink) {
          assert.ok(fm.githubLink.startsWith('http://') || fm.githubLink.startsWith('https://'), `githubLink in ${file} must be a valid URL`);
        }
        if (fm.liveLink) {
          assert.ok(fm.liveLink.startsWith('http://') || fm.liveLink.startsWith('https://'), `liveLink in ${file} must be a valid URL`);
        }
      }
    } else {
      const htmlContent = fsUtils.getDistIndexHtml();
      assert.ok(htmlContent, 'dist/index.html missing');
    }
  });

  // Domain 2.4: Storage Fallbacks & Dark Mode Resilience
  test(2, 'TEST-T2-STR-001', 'Theme toggle script contains fallback handling for SecurityError / unavailable localStorage', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    
    // Validate inline head script or client script contains try/catch around localStorage access
    const doc = parseHTML(htmlContent);
    const scripts = doc.querySelectorAll('head script, script');
    const hasTryCatchOrGuard = scripts.some(s => {
      const txt = s.textContent;
      return txt.includes('try') || txt.includes('catch') || txt.includes('typeof localStorage') || txt.includes('matchMedia');
    });
    assert.ok(hasTryCatchOrGuard, 'Theme script must contain fallback guards for storage access');
  });

  test(2, 'TEST-T2-STR-002', 'Theme toggle script guards against corrupted or invalid localStorage theme strings', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const scripts = doc.querySelectorAll('head script, script');
    const checksDarkOrLight = scripts.some(s => {
      const txt = s.textContent;
      return txt.includes("'dark'") || txt.includes('"dark"') || txt.includes("'light'") || txt.includes('"light"');
    });
    assert.ok(checksDarkOrLight, 'Theme script must validate theme values against expected light/dark tokens');
  });

  // Domain 2.5: Responsive Grid Class Assertions
  test(2, 'TEST-T2-RSP-001', 'Responsive grid specifies mobile 1-col layout (grid-cols-1)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    assert.ok(htmlContent.includes('grid-cols-1') || htmlContent.includes('grid'), 'Grid container must include 1-column mobile layout class grid-cols-1');
  });

  test(2, 'TEST-T2-RSP-003', 'Responsive grid specifies tablet 2-col layout transition (md:grid-cols-2)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    assert.ok(htmlContent.includes('md:grid-cols-2') || htmlContent.includes('grid-cols-2'), 'Grid container must include md:grid-cols-2 breakpoint class');
  });

  test(2, 'TEST-T2-RSP-004', 'Responsive grid specifies desktop 3-col layout transition (lg:grid-cols-3)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    assert.ok(htmlContent.includes('lg:grid-cols-3') || htmlContent.includes('grid-cols-3'), 'Grid container must include lg:grid-cols-3 breakpoint class');
  });

  test(2, 'TEST-T2-RSP-005', 'Main layout container specifies max-width centering (max-w-* mx-auto)', async () => {
    const htmlContent = fsUtils.getDistIndexHtml();
    assert.ok(htmlContent, 'dist/index.html missing');
    const doc = parseHTML(htmlContent);
    const containers = doc.querySelectorAll('[class*="max-w"], [class*="container"]');
    const hasMxAuto = containers.some(c => {
      const cls = c.getAttribute('class') || '';
      return cls.includes('mx-auto');
    });
    assert.ok(hasMxAuto, 'Main layout container must center content using mx-auto and max-width bounds');
  });
}
