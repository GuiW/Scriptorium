import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  checkRepository,
  hardcodedColors,
  localProps,
  tokenNames,
  usedVars,
} from './check-tokens.mjs';

test('reads the token names from the generated CSS', () => {
  const names = tokenNames(':root {\n  --surface: #f3e9d2;\n  --space-1: 4px;\n}');
  assert.deepEqual([...names], ['surface', 'space-1']);
});

test('finds custom properties declared in CSS or set from Angular', () => {
  const css = '.gr-rep--warm { --rep: var(--rep-warm); }\n.gr-bnav__ribbon {\n  --notch: 12px;\n}';
  assert.deepEqual([...localProps(css)], ['rep', 'notch']);
  const ts = `host: { '[style.--gr-tabs-x]': 'x()' }; el.style.setProperty('--gr-rep-x', v);`;
  assert.deepEqual([...localProps(ts)], ['gr-tabs-x', 'gr-rep-x']);
});

test('lists every var() use with its line', () => {
  const uses = usedVars(
    'a { color: var(--ink); }\nb { margin: var( --space-2) var(--size-tg, 0); }',
  );
  assert.deepEqual(uses, [
    { name: 'ink', line: 1 },
    { name: 'space-2', line: 2 },
    { name: 'size-tg', line: 2 },
  ]);
});

test('catches hard-coded colours', () => {
  const found = hardcodedColors(
    'a { color: #a8353e; }\nb { background: rgba(0, 0, 0, .5); border-color: #FFF; }\nc { fill: hsl(10 50% 50%); }',
  );
  assert.deepEqual(
    found.map((f) => `${f.line}:${f.value}`),
    ['1:#a8353e', '2:rgba(', '2:#FFF', '3:hsl('],
  );
});

test('does not mistake template references, ids or entities for colours', () => {
  const template =
    '<span #stepEl></span><a href="#abc-def">x</a><ng-template #content /> &#123; #add';
  assert.deepEqual(
    hardcodedColors(template).map((f) => f.value),
    ['#add'],
  );
  assert.deepEqual(hardcodedColors('<span #step class="a">'), []);
});

test('the repository uses known tokens only and no hard-coded colour', () => {
  assert.deepEqual(checkRepository(), []);
});
