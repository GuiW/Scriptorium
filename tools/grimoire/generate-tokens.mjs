#!/usr/bin/env node
/**
 * Generates the Grimoire theme files from `design/grimoire/tokens.json`:
 *  - tokens.css: CSS variables (default theme in :root, other themes in [data-theme="…"]);
 *  - color-tokens.generated.ts: themes and colour token names, for TypeScript code.
 *
 * No dependencies. Usage: node tools/grimoire/generate-tokens.mjs [--tokens f] [--css f] [--ts f]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULTS = {
  tokens: resolve(ROOT, 'design/grimoire/tokens.json'),
  css: resolve(ROOT, 'projects/ui-grimoire/src/styles/tokens.css'),
  ts: resolve(ROOT, 'projects/ui-grimoire/src/lib/theme/color-tokens.generated.ts'),
};

const HEADER =
  'GENERATED from design/grimoire/tokens.json by tools/grimoire/generate-tokens.mjs — do not edit, run `npm run tokens`.';

// tokens.json does not say whether a theme is light or dark: declare it here for each theme.
const COLOR_SCHEME = { parchment: 'light', dungeon: 'dark' };

const ALIAS = /^\{([a-z0-9-]+)\}$/;

function fail(message) {
  throw new Error(`tokens.json: ${message}`);
}

/**
 * A token's values per theme.
 *  - object { theme: value }: every theme key required, none extra;
 *  - alias "{other-token}": `var(--other-token)` in every theme (resolved where used, not where declared);
 *  - literal string: default theme only.
 */
function resolveValues(token, kind, themes, known) {
  const { name, value } = token;
  if (typeof name !== 'string' || !name) fail(`${kind}: token without a name`);

  if (typeof value === 'string') {
    const alias = ALIAS.exec(value);
    if (!alias) return { values: { [themes[0]]: value }, alias: false };
    if (alias[1] === name) fail(`${kind} "${name}": alias to itself`);
    if (!known.has(alias[1])) fail(`${kind} "${name}": alias to unknown token "${alias[1]}"`);
    return {
      values: Object.fromEntries(themes.map((t) => [t, `var(--${alias[1]})`])),
      alias: true,
    };
  }

  if (value && typeof value === 'object') {
    const missing = themes.filter((t) => typeof value[t] !== 'string' || !value[t]);
    if (missing.length) fail(`${kind} "${name}": missing value for ${missing.join(', ')}`);
    const extra = Object.keys(value).filter((k) => !themes.includes(k));
    if (extra.length) fail(`${kind} "${name}": unknown theme ${extra.join(', ')}`);
    return { values: { ...value }, alias: false };
  }

  return fail(`${kind} "${name}": missing or invalid value`);
}

function collect(tokens, kind, themes) {
  if (!Array.isArray(tokens) || !tokens.length) fail(`${kind}: no tokens`);
  const names = tokens.map((t) => t.name);
  const duplicate = names.find((n, i) => names.indexOf(n) !== i);
  if (duplicate) fail(`${kind}: duplicate token "${duplicate}"`);
  const known = new Set(names);
  return tokens.map((token) => ({
    name: token.name,
    usage: token.usage ?? '',
    ...resolveValues(token, kind, themes, known),
  }));
}

function flat(tokens, kind) {
  if (!Array.isArray(tokens) || !tokens.length) fail(`${kind}: no tokens`);
  return tokens.map((t) => {
    if (typeof t.name !== 'string' || typeof t.value !== 'string') fail(`${kind}: invalid token`);
    return [t.name, t.value];
  });
}

function typeStyles(type) {
  const families = type?.families ?? {};
  const lines = [];
  for (const [name, value] of Object.entries(families)) lines.push([`font-${name}`, value]);
  for (const group of type?.groups ?? []) {
    if (!(group.family in families)) fail(`type "${group.name}": unknown family "${group.family}"`);
    for (const s of group.styles) {
      const { name, fontSize, lineHeight, fontWeight, fontStyle, letterSpacing } = s;
      if (!name || !fontSize || !lineHeight || !fontWeight)
        fail(`type "${name}": incomplete style`);
      const italic = fontStyle && fontStyle !== 'normal' ? `${fontStyle} ` : '';
      lines.push([
        `type-${name}`,
        `${italic}${fontWeight} ${fontSize}/${lineHeight} var(--font-${group.family})`,
      ]);
      if (letterSpacing) lines.push([`type-${name}-tracking`, letterSpacing]);
    }
  }
  return lines;
}

const declare = (entries) => entries.map(([n, v]) => `  --${n}: ${v};`);

const single = (text) => `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

/** @param {object} json contents of tokens.json @returns {{ css: string, ts: string }} */
export function buildTokens(json) {
  const themes = (json.color?.themes ?? []).map((t) => t.id);
  if (!themes.length) fail('color.themes: no themes');
  for (const id of themes)
    if (!(id in COLOR_SCHEME)) fail(`theme "${id}": color-scheme must be declared in the script`);
  const [base, ...others] = themes;

  const colors = collect(json.color.tokens, 'color', themes);
  const shadows = collect(json.shadow?.tokens, 'shadow', themes);

  const themedLines = (theme, group) =>
    group.map((t) => [t.name, t.values[theme]]).filter(([, v]) => v !== undefined);

  const blocks = [];
  blocks.push(
    [
      ':root {',
      `  color-scheme: ${COLOR_SCHEME[base]};`,
      '',
      `  /* Colours — ${json.color.themes[0].name} */`,
      ...declare(themedLines(base, colors)),
      '',
      `  /* Shadows — ${json.color.themes[0].name} */`,
      ...declare(themedLines(base, shadows)),
      '',
      '  /* Typography */',
      ...declare(typeStyles(json.type)),
      '',
      '  /* Spacing */',
      ...declare(flat(json.spacing?.tokens, 'spacing')),
      '',
      '  /* Radii */',
      ...declare(flat(json.radius?.tokens, 'radius')),
      '',
      '  /* Sizes */',
      ...declare(flat(json.size?.tokens, 'size')),
      '}',
    ].join('\n'),
  );

  for (const [i, theme] of others.entries()) {
    // Only what changes: the theme's own values, and aliases (resolved by var() on the element that declares them).
    const changed = (group) =>
      group
        .filter((t) => t.alias || t.values[theme] !== t.values[base])
        .map((t) => [t.name, t.values[theme]]);
    blocks.push(
      [
        `[data-theme="${theme}"] {`,
        `  color-scheme: ${COLOR_SCHEME[theme]};`,
        '',
        `  /* Colours — ${json.color.themes[i + 1].name} */`,
        ...declare(changed(colors)),
        '',
        `  /* Shadows — ${json.color.themes[i + 1].name} */`,
        ...declare(changed(shadows)),
        '}',
      ].join('\n'),
    );
  }

  const css = `/* ${HEADER} */\n\n${blocks.join('\n\n')}\n`;

  const ts =
    [
      `// ${HEADER}`,
      '',
      'export const THEMES = [',
      ...json.color.themes.map((t) => `  { id: ${single(t.id)}, name: ${single(t.name)} },`),
      '] as const;',
      '',
      "export type ThemeId = (typeof THEMES)[number]['id'];",
      '',
      `export const DEFAULT_THEME: ThemeId = ${single(base)};`,
      '',
      'export const COLOR_TOKENS = [',
      ...colors.map((t) => `  { name: ${single(t.name)}, usage: ${single(t.usage)} },`),
      '] as const;',
      '',
      "export type ColorTokenName = (typeof COLOR_TOKENS)[number]['name'];",
    ].join('\n') + '\n';

  return { css, ts };
}

function main() {
  const { values } = parseArgs({
    options: {
      tokens: { type: 'string', default: DEFAULTS.tokens },
      css: { type: 'string', default: DEFAULTS.css },
      ts: { type: 'string', default: DEFAULTS.ts },
    },
  });
  const { css, ts } = buildTokens(JSON.parse(readFileSync(values.tokens, 'utf8')));
  for (const [file, content] of [
    [values.css, css],
    [values.ts, ts],
  ]) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content, 'utf8');
    console.log(`wrote ${file}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
