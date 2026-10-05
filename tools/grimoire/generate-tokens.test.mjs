import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildTokens } from './generate-tokens.mjs';

const tokensPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../design/grimoire/tokens.json',
);
const source = JSON.parse(readFileSync(tokensPath, 'utf8'));
const clone = () => structuredClone(source);

/** The `--name: value` declarations of a CSS block, in order. */
function block(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `block ${selector} not found`);
  const body = css.slice(start, css.indexOf('\n}', start));
  return new Map([...body.matchAll(/^ {2}--([a-z0-9-]+): (.+);$/gm)].map((m) => [m[1], m[2]]));
}

const { css, ts } = buildTokens(source);
const root = block(css, ':root');
const dungeon = block(css, '[data-theme="dungeon"]');
const colorTokens = source.color.tokens;
const literal = (t, theme) => (typeof t.value === 'string' ? undefined : t.value[theme]);

test('declares every colour token in :root with its Parchment value', () => {
  for (const t of colorTokens) {
    if (typeof t.value === 'string') continue;
    assert.equal(root.get(t.name), literal(t, 'parchment'), t.name);
  }
});

test('gives the Dungeon block the Dungeon value of every token that differs', () => {
  for (const t of colorTokens) {
    if (typeof t.value === 'string') continue;
    assert.equal(dungeon.get(t.name), literal(t, 'dungeon'), t.name);
  }
});

test('declares --focus as an alias of --arcane in both blocks', () => {
  assert.equal(root.get('focus'), 'var(--arcane)');
  assert.equal(dungeon.get('focus'), 'var(--arcane)');
});

test('declares shadows for both themes', () => {
  for (const t of source.shadow.tokens) {
    assert.equal(root.get(t.name), t.value.parchment, t.name);
    assert.equal(dungeon.get(t.name), t.value.dungeon, t.name);
  }
});

test('puts fonts, spacing, radii, sizes and motion in :root only', () => {
  for (const [name, value] of Object.entries(source.type.families)) {
    assert.equal(root.get(`font-${name}`), value);
    assert.equal(dungeon.has(`font-${name}`), false);
  }
  for (const t of [
    ...source.spacing.tokens,
    ...source.radius.tokens,
    ...source.size.tokens,
    ...source.motion.tokens,
  ]) {
    assert.equal(root.get(t.name), t.value, t.name);
    assert.equal(dungeon.has(t.name), false, t.name);
  }
});

test('emits type styles as font shorthands', () => {
  assert.equal(root.get('type-body-lg'), '400 19px/30px var(--font-serif)');
  assert.equal(root.get('type-quote'), 'italic 400 18px/28px var(--font-serif)');
  assert.equal(root.get('type-label-caps'), '700 12px/16px var(--font-display)');
  assert.equal(root.get('type-label-caps-tracking'), '0.12em');
  assert.equal(root.has('type-body-tracking'), false);
});

test('sets color-scheme per theme', () => {
  assert.match(css, /:root \{\n {2}color-scheme: light;/);
  assert.match(css, /\[data-theme="dungeon"\] \{\n {2}color-scheme: dark;/);
});

test('exposes themes and colour names in the generated TypeScript', () => {
  assert.match(ts, /\{ id: 'dungeon', name: 'Dungeon' \}/);
  assert.match(ts, /DEFAULT_THEME: ThemeId = 'parchment'/);
  for (const t of colorTokens) assert.ok(ts.includes(`{ name: '${t.name}',`), t.name);
});

test('is deterministic', () => {
  assert.deepEqual(buildTokens(clone()), { css, ts });
});

test('fails when a theme has no value', () => {
  const json = clone();
  delete json.color.tokens[0].value.dungeon;
  assert.throws(() => buildTokens(json), /"surface": missing value for dungeon/);
});

test('fails when a token has an unknown theme', () => {
  const json = clone();
  json.color.tokens[0].value.crypte = '#000000';
  assert.throws(() => buildTokens(json), /unknown theme crypte/);
});

test('fails when an alias points to an unknown token', () => {
  const json = clone();
  json.color.tokens.find((t) => t.name === 'focus').value = '{introuvable}';
  assert.throws(() => buildTokens(json), /alias to unknown token "introuvable"/);
});

test('fails on a duplicate token', () => {
  const json = clone();
  json.color.tokens.push(structuredClone(json.color.tokens[0]));
  assert.throws(() => buildTokens(json), /duplicate token "surface"/);
});

test('fails when a type style names an unknown family', () => {
  const json = clone();
  json.type.groups[0].family = 'gothique';
  assert.throws(() => buildTokens(json), /unknown family "gothique"/);
});
