/**
 * tests/helpers/fs_utils.mjs
 * Filesystem helpers using node:fs to inspect dist output, source files, and YAML frontmatter.
 */

import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = '/mnt/Proyectos/homepage';

export function fileExists(filePath) {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  } catch {
    return false;
  }
}

export function dirExists(dirPath) {
  try {
    const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  } catch {
    return false;
  }
}

export function readFile(filePath) {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return null;
  }
}

export function listDir(dirPath) {
  try {
    const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath);
  } catch {
    return [];
  }
}

export function getDistIndexHtml() {
  return readFile('dist/index.html');
}

export function getDistAssets() {
  const assetsDir = path.join(PROJECT_ROOT, 'dist/_astro');
  return listDir(assetsDir);
}

export function getProjectMarkdownFiles() {
  const projectsDir = path.join(PROJECT_ROOT, 'src/content/projects');
  if (!dirExists(projectsDir)) return [];
  return listDir(projectsDir)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => path.join(projectsDir, file));
}

/**
 * Parses simple YAML frontmatter from Markdown text.
 * @param {string} content Markdown file content
 * @returns {Object} Key-value pairs extracted from frontmatter
 */
export function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') return {};
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return {};

  const yamlBlock = frontmatterMatch[1];
  const result = {};
  const lines = yamlBlock.split(/\r?\n/);

  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Array item line e.g. - Flutter
    if (trimmed.startsWith('- ') && currentKey) {
      const itemVal = trimmed.substring(2).trim().replace(/^["']|["']$/g, '');
      if (!Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      result[currentKey].push(itemVal);
      continue;
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.substring(0, colonIdx).trim();
      let valStr = trimmed.substring(colonIdx + 1).trim();

      currentKey = key;

      if (!valStr) {
        // Might be an array coming next
        result[key] = [];
      } else {
        // Parse inline primitives or array e.g. ["Flutter", "Python"]
        if (valStr.startsWith('[') && valStr.endsWith(']')) {
          const rawArray = valStr.substring(1, valStr.length - 1);
          result[key] = rawArray.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        } else if (valStr === 'true') {
          result[key] = true;
        } else if (valStr === 'false') {
          result[key] = false;
        } else if (!isNaN(Number(valStr))) {
          result[key] = Number(valStr);
        } else {
          result[key] = valStr.replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  return result;
}
