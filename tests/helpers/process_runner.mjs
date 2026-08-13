/**
 * tests/helpers/process_runner.mjs
 * Process execution helper using node:child_process spawnSync / execSync with timeout handling.
 */

import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const DEFAULT_CWD = '/mnt/Proyectos/homepage';
const DEFAULT_TIMEOUT = 60000; // 60 seconds

/**
 * Execute a shell command synchronously with timeout and capture output.
 * @param {string} command String command (e.g. 'pnpm run build')
 * @param {Object} options Options object (cwd, timeout, env)
 * @returns {{ command: string, code: number, stdout: string, stderr: string, ok: boolean, durationMs: number, timedOut: boolean, error: Error|null }}
 */
export function runCommand(command, options = {}) {
  const cwd = options.cwd || DEFAULT_CWD;
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const env = { ...process.env, ...options.env };

  const start = performance.now();
  let result;
  let timedOut = false;
  let error = null;

  try {
    result = spawnSync(command, {
      shell: true,
      cwd,
      timeout,
      env,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
  } catch (err) {
    error = err;
    if (err.code === 'ETIMEDOUT') {
      timedOut = true;
    }
  }

  const durationMs = Math.round(performance.now() - start);

  const stdout = result?.stdout ? String(result.stdout) : '';
  const stderr = result?.stderr ? String(result.stderr) : '';
  const code = result?.status !== null && result?.status !== undefined ? result.status : (error ? 1 : 0);
  const ok = code === 0 && !timedOut;

  return {
    command,
    code,
    stdout,
    stderr,
    ok,
    durationMs,
    timedOut,
    error
  };
}

export function runBuild(options = {}) {
  return runCommand('pnpm run build', options);
}

export function runCheck(options = {}) {
  return runCommand('pnpm run check', options);
}

export function runLint(options = {}) {
  return runCommand('pnpm run lint', options);
}
