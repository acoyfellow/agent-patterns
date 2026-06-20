type Stop = 'complete' | 'turn-budget' | 'token-budget';
type Input = { maxTurns: number; maxTokens: number; tokensPerTurn: number; completeAfter: number };

const json = (body: unknown, status = 200) => Response.json(body, { status });
const valid = (value: unknown): value is Input => {
  if (!value || typeof value !== 'object') return false;
  const input = value as Record<string, unknown>;
  return ['maxTurns', 'maxTokens', 'tokensPerTurn', 'completeAfter'].every(
    (key) =>
      Number.isSafeInteger(input[key]) && Number(input[key]) > 0 && Number(input[key]) <= 10_000,
  );
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health')
      return json({ ok: true, pattern: 'bounded-loop', primitive: 'Cloudflare Workers' });
    if (request.method !== 'POST' || url.pathname !== '/run')
      return json({ error: 'not-found' }, 404);
    let input: unknown;
    try {
      input = await request.json();
    } catch {
      return json({ error: 'invalid-json' }, 400);
    }
    if (!valid(input)) return json({ error: 'invalid-input' }, 400);
    let tokens = 0;
    let turns = 0;
    const result = (stop: Stop) => json({ stop, turns, tokens });
    for (; turns < input.maxTurns; turns++) {
      if (tokens >= input.maxTokens) return result('token-budget');
      tokens += input.tokensPerTurn;
      if (turns + 1 >= input.completeAfter) {
        turns++;
        return result('complete');
      }
    }
    return result('turn-budget');
  },
};
