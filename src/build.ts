import { mkdir, rm, writeFile } from 'node:fs/promises';
import { patterns } from './patterns.ts';

const escapeHtml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cards = patterns
  .map(
    (p) =>
      `<article id="${p.slug}" class="pattern"><header><span>${p.number}</span><h2>${p.name}</h2></header><p class="promise">${p.promise}</p><div class="columns"><div><h3>Use when</h3><p>${p.useWhen}</p><h3>Mechanism</h3><ol>${p.mechanism.map((x) => `<li>${x}</li>`).join('')}</ol></div><pre><code>${escapeHtml(p.code)}</code></pre></div></article>`,
  )
  .join('\n');
const nav = patterns.map((p) => `<a href="#${p.slug}"><b>${p.number}</b>${p.name}</a>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Live-proven patterns for bounded agent systems on Cloudflare."><title>Agent Patterns</title><link rel="stylesheet" href="/style.css"></head><body><header class="top"><a href="#main" class="brand">AGENT / PATTERNS</a><a href="https://github.com/acoyfellow/agent-patterns">SOURCE ↗</a></header><main id="main"><section class="hero"><p class="eyebrow">A FIELD GUIDE · 0.0.1</p><h1>Use tokens to<br><em>build the things.</em></h1><p>A small catalog generated only from runnable examples with live Cloudflare deployment receipts.</p><div class="flow"><span>RUNNABLE SOURCE</span><i>→</i><span>LIVE HTTPS PROBE</span><i>→</i><span>SANITIZED RECEIPT</span></div></section><nav class="index" aria-label="Pattern index">${nav}</nav><section class="library">${cards}</section><section class="choose"><p class="eyebrow">EVIDENCE POLICY</p><h2>Prove it or omit it.</h2><div class="matrix"><p><b>Source</b><br>Runnable Worker code.</p><p><b>Deploy</b><br>Isolated Alchemy stage.</p><p><b>Probe</b><br>Live HTTPS assertions.</p><p><b>Cleanup</b><br>Destroy in a finally trap.</p></div></section></main><footer><span>Built on Cloudflare</span><span>MIT · acoyfellow</span></footer></body></html>`;
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await writeFile('dist/index.html', html);
await writeFile('dist/style.css', await Bun.file('public/style.css').text());
await writeFile(
  'dist/robots.txt',
  'User-agent: *\nAllow: /\nSitemap: https://agent-patterns.coey.dev/sitemap.xml\n',
);
await writeFile(
  'dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://agent-patterns.coey.dev/</loc></url></urlset>',
);
await writeFile(
  'dist/llms.txt',
  `# Agent Patterns\n\n${patterns.map((p) => `## ${p.name}\n${p.promise}\n${p.mechanism.join(' ')}`).join('\n\n')}\n`,
);
console.log(`Built ${patterns.length} patterns.`);
