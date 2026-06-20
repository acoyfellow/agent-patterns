import { $ } from 'bun';

const cwd = import.meta.dir;
const stage = `e2e-${Date.now()}`;
const receipt = { timestamp: new Date().toISOString(), stage, assertions: [] as string[] };
try {
  const deployed = await $`bunx alchemy deploy --stage ${stage}`
    .cwd(cwd)
    .env({ ...process.env, STAGE: stage })
    .text();
  const endpoint = deployed.match(/E2E_URL=(https:\/\/\S+)/)?.[1];
  if (!endpoint) throw new Error(`deployment did not report URL: ${deployed}`);
  const assert = async (name: string, path: string, init: RequestInit, expected: unknown) => {
    const response = await fetch(`${endpoint}${path}`, init);
    const body = await response.json();
    if (!response.ok || JSON.stringify(body) !== JSON.stringify(expected))
      throw new Error(`${name}: ${response.status} ${JSON.stringify(body)}`);
    receipt.assertions.push(name);
  };
  await assert(
    'health identifies Worker primitive',
    '/health',
    {},
    { ok: true, pattern: 'bounded-loop', primitive: 'Cloudflare Workers' },
  );
  const post = (body: unknown) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  await assert(
    'completes within budget',
    '/run',
    post({ maxTurns: 5, maxTokens: 20, tokensPerTurn: 2, completeAfter: 2 }),
    { stop: 'complete', turns: 2, tokens: 4 },
  );
  await assert(
    'stops at turn budget',
    '/run',
    post({ maxTurns: 2, maxTokens: 20, tokensPerTurn: 2, completeAfter: 9 }),
    { stop: 'turn-budget', turns: 2, tokens: 4 },
  );
  await assert(
    'stops at token budget',
    '/run',
    post({ maxTurns: 9, maxTokens: 3, tokensPerTurn: 3, completeAfter: 9 }),
    { stop: 'token-budget', turns: 1, tokens: 3 },
  );
  console.log(
    JSON.stringify({ ...receipt, endpoint: 'ephemeral workers.dev URL', result: 'pass' }, null, 2),
  );
} finally {
  await $`bunx alchemy destroy --stage ${stage}`
    .cwd(cwd)
    .env({ ...process.env, STAGE: stage })
    .quiet()
    .nothrow();
}
