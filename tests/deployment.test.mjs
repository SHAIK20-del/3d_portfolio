import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');

// A static host cannot transpile the development entry point. Test the actual
// generated page, rather than only checking that the build command succeeded.
test('production HTML references existing, compiled local assets', async () => {
  const html = await readFile(resolve(output, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /(?:src|href)=["'][^"']*(?:\/src\/|\.tsx?\b)/);
  const entries = [...html.matchAll(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/g)];
  assert.ok(entries.length > 0, 'The production page must load a module entry point');
  for (const [, entry] of entries) {
    assert.match(entry, /^\.\/assets\/.+\.js$/, 'Vite must emit portable compiled JS paths');
  }
  const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
  for (const asset of assets) {
    assert.ok(!asset.startsWith('/'), `Asset must work below a host subdirectory: ${asset}`);
    const file = resolve(output, asset);
    assert.ok(file.startsWith(output + sep), `Asset must remain inside dist: ${asset}`);
    assert.ok((await stat(file)).isFile(), `Missing deployable asset: ${asset}`);
    assert.ok((await stat(file)).size > 0, `Empty deployable asset: ${asset}`);
  }
  assert.match(html, /rel="icon"[^>]*href="\.\/favicon\.svg"/);
  assert.match(await readFile(resolve(output, 'favicon.svg'), 'utf8'), /<svg\b/);
});

test('Netlify builds and publishes the production directory', async () => {
  const config = await readFile(resolve(root, 'netlify.toml'), 'utf8');
  const build = config.split('[build]')[1]?.split(/\n\[/)[0];
  assert.ok(build, 'Netlify needs explicit build configuration');
  assert.match(build, /command\s*=\s*"npm run build"/);
  assert.match(build, /publish\s*=\s*"dist"/);
});
