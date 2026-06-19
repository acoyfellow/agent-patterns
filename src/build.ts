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
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Six practical patterns for bounded, steerable, cost-conscious agent systems."><title>Agent Patterns</title><link rel="stylesheet" href="/style.css"></head><body><header class="top"><a href="#main" class="brand">AGENT / PATTERNS</a><a href="https://github.com/acoyfellow/agent-patterns">SOURCE ↗</a></header><main id="main"><section class="hero"><p class="eyebrow">A FIELD GUIDE · 0.0.1</p><h1>Use tokens to<br><em>build the things.</em></h1><p>Loops do not have to be expensive. Build guardrails and harnesses once, flatten execution into durable steps, then spend inference only where judgment remains.</p><div class="flow"><span>FUZZY INPUT</span><i>→</i><span>COMPILED RULES</span><i>→</i><span>BOUNDED JUDGMENT</span></div></section><nav class="index" aria-label="Pattern index">${nav}</nav><section class="library">${cards}</section><section class="choose"><p class="eyebrow">DECISION GUIDE</p><h2>Start at the constraint.</h2><div class="matrix"><p><b>Repeated judgment?</b><br>Compile the fuzzy.</p><p><b>Uncertain duration?</b><br>Bound every loop.</p><p><b>Needs recovery?</b><br>Use durable, flat steps.</p><p><b>Wide tool access?</b><br>Define a steering envelope.</p><p><b>Unclear implementation?</b><br>Build the harness first.</p><p><b>Irreversible effect?</b><br>Add a human checkpoint.</p></div></section></main><footer><span>Built on Cloudflare</span><span>MIT · acoyfellow</span></footer></body></html>`;
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
