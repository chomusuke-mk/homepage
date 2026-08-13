/**
 * tests/helpers/html_parser.mjs
 * ESM HTML micro-parser for inspecting static HTML output in Node.js 24 without external dependencies.
 */

export class HTMLElement {
  constructor(tagName = '', attributes = {}, parent = null) {
    this.tagName = tagName.toLowerCase();
    this.attributes = attributes;
    this.parent = parent;
    this.children = [];
    this.textNodes = [];
  }

  getAttribute(name) {
    if (!name) return null;
    const lower = name.toLowerCase();
    for (const [key, val] of Object.entries(this.attributes)) {
      if (key.toLowerCase() === lower) {
        return val;
      }
    }
    return null;
  }

  hasAttribute(name) {
    if (!name) return false;
    const lower = name.toLowerCase();
    return Object.keys(this.attributes).some(k => k.toLowerCase() === lower);
  }

  get classList() {
    const classAttr = this.getAttribute('class') || '';
    const classes = classAttr.split(/\s+/).filter(Boolean);
    return {
      contains: (cls) => classes.includes(cls),
      value: classAttr,
      toArray: () => [...classes]
    };
  }

  get textContent() {
    let result = '';
    for (const child of this.children) {
      if (typeof child === 'string') {
        result += child;
      } else if (child instanceof HTMLElement) {
        result += child.textContent;
      }
    }
    return result.trim();
  }

  get innerHTML() {
    let html = '';
    for (const child of this.children) {
      if (typeof child === 'string') {
        html += escapeText(child);
      } else if (child instanceof HTMLElement) {
        html += child.outerHTML;
      }
    }
    return html;
  }

  get outerHTML() {
    if (this.tagName === '#document') {
      return this.innerHTML;
    }
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => (v === '' || v === true ? k : `${k}="${escapeAttr(String(v))}"`))
      .join(' ');
    const attrString = attrs ? ' ' + attrs : '';
    const selfClosing = ['img', 'link', 'meta', 'br', 'hr', 'input', 'source'].includes(this.tagName);
    if (selfClosing) {
      return `<${this.tagName}${attrString} />`;
    }
    return `<${this.tagName}${attrString}>${this.innerHTML}</${this.tagName}>`;
  }

  querySelector(selector) {
    const matches = this.querySelectorAll(selector);
    return matches.length > 0 ? matches[0] : null;
  }

  querySelectorAll(selector) {
    if (!selector || typeof selector !== 'string') return [];
    const commaSubSelectors = selector.split(',').map(s => s.trim()).filter(Boolean);
    const results = [];

    for (const sub of commaSubSelectors) {
      const parts = sub.split(/\s+/).filter(Boolean);
      let currentElements = [this];

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let nextElements = [];
        for (const elem of currentElements) {
          const candidates = elem.getAllDescendants();
          for (const candidate of candidates) {
            if (matchSingleSelector(candidate, part)) {
              if (!nextElements.includes(candidate)) {
                nextElements.push(candidate);
              }
            }
          }
        }
        currentElements = nextElements;
      }

      for (const el of currentElements) {
        if (!results.includes(el)) {
          results.push(el);
        }
      }
    }

    return results;
  }

  getAllDescendants() {
    const list = [];
    for (const child of this.children) {
      if (child instanceof HTMLElement) {
        list.push(child);
        list.push(...child.getAllDescendants());
      }
    }
    return list;
  }
}

function escapeText(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function matchSingleSelector(elem, selectorPart) {
  if (elem.tagName === '#document') return false;

  // Tag + class match, e.g. article.project-card, button#theme-toggle, .btn-primary
  let tag = '';
  let id = '';
  let classes = [];
  
  let s = selectorPart;

  // Check for attribute selector like [data-project-id="vidra"] or a[target="_blank"]
  if (s.includes('[')) {
    const bracketIndex = s.indexOf('[');
    const tagPrefix = s.substring(0, bracketIndex);
    const attrExpr = s.substring(bracketIndex);
    if (tagPrefix && !matchSingleSelector(elem, tagPrefix)) {
      return false;
    }
    const innerAttrMatch = attrExpr.match(/^\[([a-zA-Z0-9_.:-]+)(?:\s*([~*^$|]?=)\s*["']?([^"']*)["']?)?\]$/);
    if (innerAttrMatch) {
      const [, attrName, operator, attrVal] = innerAttrMatch;
      if (!elem.hasAttribute(attrName)) return false;
      if (operator) {
        const actual = elem.getAttribute(attrName) || '';
        if (operator === '=') return actual === attrVal;
        if (operator === '~=') return actual.split(/\s+/).includes(attrVal);
        if (operator === '*=') return actual.includes(attrVal);
        if (operator === '^=') return actual.startsWith(attrVal);
        if (operator === '$=') return actual.endsWith(attrVal);
      }
      return true;
    }
  }

  // ID
  if (s.includes('#')) {
    const hashIdx = s.indexOf('#');
    tag = s.substring(0, hashIdx);
    const rest = s.substring(hashIdx + 1);
    const dotIdx = rest.indexOf('.');
    if (dotIdx !== -1) {
      id = rest.substring(0, dotIdx);
      classes = rest.substring(dotIdx + 1).split('.').filter(Boolean);
    } else {
      id = rest;
    }
  } else if (s.includes('.')) {
    const dotIdx = s.indexOf('.');
    tag = s.substring(0, dotIdx);
    classes = s.substring(dotIdx + 1).split('.').filter(Boolean);
  } else {
    tag = s;
  }

  if (tag && tag !== '*' && elem.tagName !== tag.toLowerCase()) {
    return false;
  }
  if (id && elem.getAttribute('id') !== id) {
    return false;
  }
  if (classes.length > 0) {
    const elemClasses = elem.classList;
    for (const cls of classes) {
      if (!elemClasses.contains(cls)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Parse an HTML string into an HTMLElement document tree.
 * @param {string} html 
 * @returns {HTMLElement} Root #document element
 */
export function parseHTML(html) {
  const root = new HTMLElement('#document');
  if (!html || typeof html !== 'string') return root;

  // Strip HTML comments and DOCTYPE
  let cleanHtml = html
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  let current = root;
  const tagRegex = /<(\/?)([a-zA-Z0-9_-]+)([^>]*?)(\/?)>|([^<]+)/g;

  let match;
  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const [, isClosing, tagName, attrString, isSelfClosing, textContent] = match;

    if (textContent) {
      if (textContent.trim() || current.tagName === 'script' || current.tagName === 'style') {
        current.children.push(textContent);
      }
      continue;
    }

    const tag = tagName.toLowerCase();

    if (isClosing) {
      // Walk up tree to matching opening tag
      let node = current;
      while (node && node.tagName !== tag && node !== root) {
        node = node.parent;
      }
      if (node && node.parent) {
        current = node.parent;
      }
      continue;
    }

    // Parse attributes
    const attributes = parseAttributes(attrString || '');
    const element = new HTMLElement(tag, attributes, current);
    current.children.push(element);

    const selfClosingTags = ['img', 'link', 'meta', 'br', 'hr', 'input', 'source', 'base', 'embed', 'area', 'col', 'param', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use', 'stop'];
    const isVoid = selfClosingTags.includes(tag);

    if (!isVoid) {
      // If tag is script or style, capture its body raw
      if (tag === 'script' || tag === 'style') {
        const endTag = `</${tag}>`;
        const endIdx = cleanHtml.indexOf(endTag, tagRegex.lastIndex);
        if (endIdx !== -1) {
          const bodyText = cleanHtml.substring(tagRegex.lastIndex, endIdx);
          element.children.push(bodyText);
          tagRegex.lastIndex = endIdx + endTag.length;
        }
      } else {
        current = element;
      }
    }
  }

  return root;
}

function parseAttributes(attrStr) {
  const attrs = {};
  if (!attrStr) return attrs;

  const attrRegex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = attrRegex.exec(attrStr)) !== null) {
    const name = match[1];
    const val = match[2] ?? match[3] ?? match[4] ?? true;
    attrs[name] = val;
  }
  return attrs;
}
