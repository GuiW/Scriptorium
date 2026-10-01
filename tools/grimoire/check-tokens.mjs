#!/usr/bin/env node
// Design-system guard (CLAUDE.md: tokens only, no hard-coded colour).
// 1. Every var(--name) used in bundle.css and in the Angular projects is a token from
//    design/grimoire/tokens.json, or a custom property declared locally (--rep, --notch…).
// 2. The Angular projects contain no hard-coded colour (#hex, rgb(), hsl()).
// Usage: node tools/grimoire/check-tokens.mjs — exits 1 and lists every problem.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildTokens } from './generate-tokens.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TOKENS = join(ROOT, 'design/grimoire/tokens.json');
const BUNDLE = join(ROOT, 'design/grimoire/components/bundle.css');
const PROJECTS = join(ROOT, 'projects');
const SOURCE_EXT = new Set(['.css', '.ts', '.html']);
/** Generated from tokens.json: they declare the tokens, they do not use them. */
const GENERATED = new Set([
  'projects/ui-grimoire/src/styles/tokens.css',
  'projects/ui-grimoire/src/lib/theme/color-tokens.generated.ts',
]);

/** Names of the custom properties declared by the generated tokens.css. */
export function tokenNames(css) {
  return new Set([...css.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]));
}

/**
 * Custom properties a file declares itself: `--name:` in CSS, or set from Angular
 * (`[style.--name]` bindings, `style.setProperty('--name', …)`).
 */
export function localProps(text) {
  const names = new Set();
  for (const m of text.matchAll(/(?:^|[\s;{])--([a-zA-Z0-9-]+)\s*:/g)) names.add(m[1]);
  for (const m of text.matchAll(/style\.--([a-zA-Z0-9-]+)/g)) names.add(m[1]);
  for (const m of text.matchAll(/setProperty\(\s*['"]--([a-zA-Z0-9-]+)['"]/g)) names.add(m[1]);
  return names;
}

/** Every `var(--name)` use, with its 1-based line. */
export function usedVars(text) {
  const uses = [];
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*--([a-zA-Z0-9-]+)/g))
      uses.push({ name: m[1], line: i + 1 });
  });
  return uses;
}

/** Hard-coded colours (#rgb, #rrggbb(aa), rgb(), rgba(), hsl(), hsla()), with their 1-based line. */
export function hardcodedColors(text) {
  const found = [];
  const pattern =
    /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?)\(/g;
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(pattern)) found.push({ value: m[0], line: i + 1 });
  });
  return found;
}

function sources(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...sources(path));
    else if (SOURCE_EXT.has(extname(entry.name))) files.push(path);
  }
  return files;
}

/** Runs both checks over the repository; returns the problems as `file:line message`. */
export function checkRepository() {
  const tokens = tokenNames(buildTokens(JSON.parse(readFileSync(TOKENS, 'utf8'))).css);
  const rel = (path) => relative(ROOT, path).split(sep).join('/');
  const files = [BUNDLE, ...sources(PROJECTS)]
    .filter((path) => !GENERATED.has(rel(path)))
    .map((path) => ({ path: rel(path), text: readFileSync(path, 'utf8') }));

  const declared = new Set(tokens);
  for (const { text } of files) for (const name of localProps(text)) declared.add(name);

  const problems = [];
  for (const { path, text } of files) {
    for (const { name, line } of usedVars(text)) {
      if (!declared.has(name)) problems.push(`${path}:${line} unknown token var(--${name})`);
    }
    // bundle.css is the design reference: its few literal shadow colours are reviewed there.
    if (path.startsWith('projects/') && !path.endsWith('.spec.ts')) {
      for (const { value, line } of hardcodedColors(text)) {
        problems.push(`${path}:${line} hard-coded colour ${value} — use a colour token`);
      }
    }
  }
  return problems;
}

function main() {
  const problems = checkRepository();
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\n${problems.length} design-token problem(s).`);
    process.exit(1);
  }
  console.log('Design tokens: every var() is known, no hard-coded colour.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
