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
  const get = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`${endpoint}${path}`, init);
    const text = await response.text();
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error(`${path}: ${response.status} non-JSON response: ${text.slice(0, 500)}`);
    }
    if (!response.ok) throw new Error(`${path}: ${response.status} ${JSON.stringify(body)}`);
    return body;
  };
  const health = await get('/health');
  if (!Array.isArray(health.primitives) || !health.primitives.includes('Workers AI')) {
    throw new Error(`health did not identify Workers AI: ${JSON.stringify(health)}`);
  }
  receipt.assertions.push('health identifies Workers and Workers AI');

  const post = (body: unknown) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const complete = await get(
    '/run',
    post({
      prompt: 'State that this inference ran on Workers AI.',
      maxTurns: 2,
      maxTokens: 256,
      tokensPerTurn: 128,
      completeAfter: 1,
    }),
  );
  if (
    complete.stop !== 'complete' ||
    complete.turns !== 1 ||
    !(complete.outputs as string[])?.[0]
  ) {
    throw new Error(`real inference did not complete: ${JSON.stringify(complete)}`);
  }
  receipt.assertions.push('Workers AI returned non-empty model output within budget');

  const turnBudget = await get(
    '/run',
    post({
      prompt: 'Return a short progress update.',
      maxTurns: 1,
      maxTokens: 256,
      tokensPerTurn: 128,
      completeAfter: 2,
    }),
  );
  if (turnBudget.stop !== 'turn-budget' || !(turnBudget.outputs as string[])?.[0]) {
    throw new Error(`turn budget failed: ${JSON.stringify(turnBudget)}`);
  }
  receipt.assertions.push('turn budget stops after a real Workers AI inference');

  const tokenBudget = await get(
    '/run',
    post({
      prompt: 'This call must not run.',
      maxTurns: 2,
      maxTokens: 64,
      tokensPerTurn: 128,
      completeAfter: 1,
    }),
  );
  if (tokenBudget.stop !== 'token-budget' || (tokenBudget.outputs as string[]).length !== 0) {
    throw new Error(`token budget failed: ${JSON.stringify(tokenBudget)}`);
  }
  receipt.assertions.push('token reservation prevents an over-budget inference');
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
