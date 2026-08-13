# Test Infrastructure & Methodology Specification — Chomusuke Homepage

## 1. Overview & Architectural Testing Strategy

The Chomusuke Homepage project relies on a requirement-driven, opaque-box E2E testing framework tailored for an Astro 4+ Static Site Generated (SSG) web application running under Node.js 24 and pnpm.

Testing is conducted across a 4-tier taxonomy—ranging from SSG build output structure and HTML DOM semantic verification to edge cases, cross-feature interaction persistence, and production build pipelines. This architecture guarantees 100% feature coverage without external browser binaries, enabling lightning-fast local execution (<1 second execution time) and zero external npm testing dependencies.

---

## 2. 4-Tier Test Case Taxonomy

| Tier       | Name                             | Scope & Focus                                                                                                                                                                                                                                                                         | Specification Count |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **Tier 1** | Feature Coverage                 | Astro SSG setup, 6 project card renderings (`vidra`, `vidra-backend`, `vidra-quickjs`, `vidra-ffmpeg`, `apt-repository`, `fdroid-repository`), Spanish copy, Light/Dark toggle presence, Semantic HTML tags, A11y focus/aria attributes.                                              | 24 Tests            |
| **Tier 2** | Boundary & Corner Cases          | Missing optional frontmatter fields (`downloadLink`), Zod default fallbacks (`featured: false`, `order: 0`), long text line clamping, schema validation error rules, localStorage SecurityError/corrupted theme fallbacks, 320px/640px/768px/1024px responsive grid class assertions. | 13 Tests            |
| **Tier 3** | Cross-Feature Interactions       | Theme toggle state persistence script & hydration, theme toggle keyboard space/enter & ARIA state, responsive grid 1-3 col transitions, external link security (`target="_blank" rel="noopener noreferrer"`), global keyboard focus flow.                                             | 5 Tests             |
| **Tier 4** | Real-World Application Scenarios | Production `pnpm run build` execution, static `dist/` directory integrity & 6 project titles pre-rendered in HTML, `astro check` static type validation, linter execution (`pnpm run lint`).                                                                                          | 4 Tests             |

---

## 3. Feature Inventory & Requirements Traceability Matrix

| Requirement                         | Description                                                                                                                                             | Target Component / Assets                                    | Mapped Test Specifications                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **R1. Core Config & Arch**          | Astro SSG build, Tailwind CSS, TS strict mode, Content Collections, Zod schema validation                                                               | `src/content/config.ts`, `tsconfig.json`, `astro.config.mjs` | TEST-T1-SSG-001, TEST-T1-SSG-002, TEST-T2-SCH-001, TC-T4-01, TC-T4-03                             |
| **R2. Design System & Components**  | Responsive 1-3 col grid, Light/Dark theme toggle, Button, TechBadge, ProjectCard, BaseLayout, A11y focus rings                                          | `src/components/*`, `src/layouts/*`, `src/styles/global.css` | TEST-T1-THM-001, TEST-T1-SEM-001..005, TEST-T1-A11Y-001..003, TEST-T2-RSP-001..005, TC-T3-01..005 |
| **R3. Local Projects & Copy**       | 6 local projects in Spanish (`vidra`, `vidra-backend`, `vidra-quickjs`, `vidra-ffmpeg`, `apt-repository`, `fdroid-repository`), installation/demo links | `src/content/projects/*.md`, `src/pages/index.astro`         | TEST-T1-CRD-vidra..fdroid, TEST-T1-CRD-007, TEST-T1-ESP-001..005, TEST-T2-OPT-001..004, TC-T4-02  |
| **R4. Multi-Agent & Quality Audit** | Code audit, clean production build (`pnpm run build`), strict type check (`astro check`), zero lint violations                                          | Root configuration, `package.json`, `dist/` output           | TC-T4-01, TC-T4-02, TC-T4-03, TC-T4-04                                                            |

---

## 4. Coverage Thresholds & Success Criteria

To achieve a status of **PASS** for the entire test suite, the codebase MUST satisfy 100% of the following quantitative and qualitative criteria:

1. **Build Integrity**: `pnpm run build` exits cleanly with status code `0` and generates production static assets in `dist/`.
2. **Static Distribution Integrity**: `dist/index.html` exists with non-zero size and contains pre-rendered semantic HTML for all 6 local project entries.
3. **Type Strictness**: `pnpm run check` (or `npx astro check`) completes with 0 errors and 0 warnings.
4. **Linting Compliance**: `pnpm run lint` returns 0 style or syntax violations.
5. **Localization & Accessibility**:
   - HTML document specifies `<html lang="es">`.
   - Zero untranslated English placeholder strings exist in production output.
   - 100% of external links specify `target="_blank"` and `rel="noopener noreferrer"`.
   - Theme state initializes via inline head script prior to DOM render to eliminate FOUC.
   - Project grid specifies responsive breakpoints for 1 column (<640px), 2 columns (640px-1023px), and 3 columns (≥1024px).

---

## 5. Automated Test Runner Framework Architecture

The E2E test framework is driven by Node 24 ESM modules located inside `/mnt/Proyectos/homepage/tests/`:

```
/mnt/Proyectos/homepage/tests/
├── runner.mjs                 # Core Test Runner CLI, Stats Aggregator & ANSI Formatter
├── run.sh                     # Shell executable entrypoint wrapper (chmod +x)
├── helpers/
│   ├── html_parser.mjs        # Native HTML micro-parser & DOM query engine
│   ├── process_runner.mjs     # Synchronous child process execution with timeouts
│   └── fs_utils.mjs           # Filesystem inspection & YAML frontmatter parser
└── suites/
    ├── tier1_feature_coverage.test.mjs    # Tier 1 Feature Coverage Suite
    ├── tier2_boundary_cases.test.mjs      # Tier 2 Boundary Cases Suite
    ├── tier3_cross_feature.test.mjs       # Tier 3 Cross-Feature Suite
    └── tier4_real_world.test.mjs          # Tier 4 Real-World Scenarios Suite
```

### Execution Commands:

```bash
# Execute complete 4-Tier test suite via shell entrypoint
./tests/run.sh

# Execute via Node directly
node tests/runner.mjs

# Execute specific tier filter
node tests/runner.mjs --tier=1
node tests/runner.mjs --tier=3

# Execute with fail-fast (bail on first error)
node tests/runner.mjs --bail

# Execute with forced build before testing
node tests/runner.mjs --build
```

### Execution Log File Output:

All runner diagnostic logs, metric tables, and failure stack traces are written automatically to:
`/mnt/Proyectos/homepage/temp/test_results.log`
