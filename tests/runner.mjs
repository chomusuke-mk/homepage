/**
 * tests/runner.mjs
 * Node 24 ESM Test Runner Framework for Chomusuke Homepage 4-Tier E2E Test Suite.
 */

import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

import { parseHTML } from './helpers/html_parser.mjs';
import * as processRunner from './helpers/process_runner.mjs';
import * as fsUtils from './helpers/fs_utils.mjs';

import registerTier1 from './suites/tier1_feature_coverage.test.mjs';
import registerTier2 from './suites/tier2_boundary_cases.test.mjs';
import registerTier3 from './suites/tier3_cross_feature.test.mjs';
import registerTier4 from './suites/tier4_real_world.test.mjs';

// ANSI Color Codes
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

function padVisual(str, targetWidth, align = 'right') {
  const clean = String(str).replace(/\x1b\[[0-9;]*m/g, '');
  const padLen = Math.max(0, targetWidth - clean.length);
  const padding = ' '.repeat(padLen);
  return align === 'left' ? str + padding : padding + str;
}

async function main() {
  const args = process.argv.slice(2);
  
  // CLI Flag Parsing
  const targetTierArg = args.find(a => a.startsWith('--tier='));
  let targetTier = null;
  if (targetTierArg) {
    const rawVal = targetTierArg.split('=')[1];
    const parsedVal = parseInt(rawVal, 10);
    if (![1, 2, 3, 4].includes(parsedVal)) {
      console.error(`Error: Invalid --tier value "${rawVal}". Must be 1, 2, 3, or 4.`);
      process.exit(1);
    }
    targetTier = parsedVal;
  }
  
  const bail = args.includes('--bail');
  const skipBuild = args.includes('--no-build');
  const forceBuild = args.includes('--build');

  const logDir = '/mnt/Proyectos/homepage/temp';
  const logFile = path.join(logDir, 'test_results.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Synchronously initialize log file
  fs.writeFileSync(logFile, '');

  const log = (msg) => {
    const cleanMsg = msg.replace(/\x1b\[[0-9;]*m/g, '');
    fs.appendFileSync(logFile, cleanMsg + '\n');
    console.log(msg);
  };

  log(`${BOLD}${CYAN}============================================================${RESET}`);
  log(`${BOLD}${CYAN}         CHOMUSUKE HOMEPAGE E2E TEST RUNNER (Node 24)       ${RESET}`);
  log(`${BOLD}${CYAN}============================================================${RESET}`);
  log(`${GRAY}Timestamp: ${new Date().toISOString()}${RESET}`);
  log(`${GRAY}Target Directory: /mnt/Proyectos/homepage${RESET}`);
  if (targetTier) log(`${YELLOW}Filter: Tier ${targetTier} tests only${RESET}`);

  // Build Phase
  if (forceBuild || (!skipBuild && !fsUtils.fileExists('dist/index.html') && fsUtils.fileExists('package.json'))) {
    log(`\n${CYAN}[+] Triggering build: pnpm run build ...${RESET}`);
    const buildRes = processRunner.runBuild();
    if (buildRes.ok) {
      log(`${GREEN}  ✓ Build complete in ${buildRes.durationMs}ms${RESET}`);
    } else {
      log(`${YELLOW}  ⚠ Build exited with code ${buildRes.code} in ${buildRes.durationMs}ms${RESET}`);
    }
  }

  const context = {
    fsUtils,
    processRunner,
    parseHTML,
    skipBuild,
    forceBuild
  };

  const registeredTests = [];
  function test(tier, id, title, fn) {
    registeredTests.push({ tier, id, title, fn });
  }

  // Register all suites
  registerTier1(test, context);
  registerTier2(test, context);
  registerTier3(test, context);
  registerTier4(test, context);

  const tierNames = {
    1: 'Tier 1: Feature Coverage',
    2: 'Tier 2: Boundary Cases',
    3: 'Tier 3: Cross-Feature',
    4: 'Tier 4: Real-World Scenarios'
  };

  const stats = {
    1: { name: tierNames[1], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 },
    2: { name: tierNames[2], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 },
    3: { name: tierNames[3], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 },
    4: { name: tierNames[4], total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 }
  };

  const failures = [];
  const globalStart = performance.now();

  let currentTier = null;

  for (const t of registeredTests) {
    const isTarget = targetTier === null || t.tier === targetTier;
    
    if (currentTier !== t.tier) {
      currentTier = t.tier;
      if (isTarget) {
        log(`\n${BOLD}[SUITE] ${tierNames[currentTier]}${RESET}`);
      }
    }

    if (!isTarget) {
      stats[t.tier].total++;
      stats[t.tier].skipped++;
      continue;
    }

    stats[t.tier].total++;
    const testStart = performance.now();

    try {
      await t.fn();
      const testDuration = Math.round(performance.now() - testStart);
      stats[t.tier].passed++;
      stats[t.tier].durationMs += testDuration;
      log(`  ${GREEN}✓${RESET} ${GRAY}[${t.id}]${RESET} ${t.title} ${GRAY}(${testDuration}ms)${RESET}`);
    } catch (err) {
      const testDuration = Math.round(performance.now() - testStart);
      stats[t.tier].failed++;
      stats[t.tier].durationMs += testDuration;
      const errorMsg = err.message || String(err);
      failures.push({ tier: t.tier, id: t.id, title: t.title, error: err });
      log(`  ${RED}✗${RESET} ${GRAY}[${t.id}]${RESET} ${t.title} ${GRAY}(${testDuration}ms)${RESET}`);
      log(`    ${RED}Error: ${errorMsg}${RESET}`);

      if (bail) {
        log(`\n${RED}[BAIL] Stopping test runner after first failure (--bail enabled)${RESET}`);
        const currIdx = registeredTests.indexOf(t);
        for (let j = currIdx + 1; j < registeredTests.length; j++) {
          const remTest = registeredTests[j];
          stats[remTest.tier].total++;
          stats[remTest.tier].skipped++;
        }
        break;
      }
    }
  }

  const globalDuration = ((performance.now() - globalStart) / 1000).toFixed(2);

  // Print Summary Table
  log(`\n${BOLD}${CYAN}------------------------------------------------------------${RESET}`);
  log(`${BOLD}${CYAN} TIER SUMMARY RESULTS                                       ${RESET}`);
  log(`${BOLD}${CYAN}------------------------------------------------------------${RESET}`);
  log(`${BOLD}${padVisual('Tier', 32, 'left')} ${padVisual('Passed', 7, 'right')} ${padVisual('Failed', 7, 'right')} ${padVisual('Skipped', 8, 'right')} ${padVisual('Time', 8, 'right')}${RESET}`);
  log(`${GRAY}------------------------------------------------------------${RESET}`);

  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (let tierNum = 1; tierNum <= 4; tierNum++) {
    const st = stats[tierNum];
    totalPassed += st.passed;
    totalFailed += st.failed;
    totalSkipped += st.skipped;

    const passStr = st.passed > 0 ? `${GREEN}${st.passed}${RESET}` : '0';
    const failStr = st.failed > 0 ? `${RED}${st.failed}${RESET}` : '0';
    const skipStr = st.skipped > 0 ? `${YELLOW}${st.skipped}${RESET}` : '0';
    const timeStr = `${st.durationMs}ms`;

    const row = `${padVisual(st.name, 32, 'left')} ${padVisual(passStr, 7, 'right')} ${padVisual(failStr, 7, 'right')} ${padVisual(skipStr, 8, 'right')} ${padVisual(timeStr, 8, 'right')}`;
    log(row);
  }

  log(`${GRAY}------------------------------------------------------------${RESET}`);
  log(`${BOLD}TOTAL: ${GREEN}${totalPassed} Passed${RESET}, ${totalFailed > 0 ? RED : GRAY}${totalFailed} Failed${RESET}, ${totalSkipped > 0 ? YELLOW : GRAY}${totalSkipped} Skipped${RESET} | Time: ${globalDuration}s`);
  log(`${BOLD}${CYAN}------------------------------------------------------------${RESET}`);

  if (failures.length > 0) {
    log(`\n${BOLD}${RED}DETAILED FAILURE SUMMARY (${failures.length}):${RESET}`);
    failures.forEach((f, idx) => {
      log(`\n${BOLD}${RED}${idx + 1}) [Tier ${f.tier} - ${f.id}] ${f.title}${RESET}`);
      log(`   ${RED}${f.error.stack || f.error.message || f.error}${RESET}`);
    });
    log(`\n${BOLD}${RED}STATUS: FAILED (Exit Code: 1)${RESET}`);
    process.exit(1);
  } else {
    log(`\n${BOLD}${GREEN}STATUS: OVERALL SUCCESS (Exit Code: 0)${RESET}`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
