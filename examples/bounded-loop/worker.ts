type Stop = 'complete' | 'turn-budget' | 'token-budget';
type Input = {
  prompt: string;
  maxTurns: number;
  maxTokens: number;
  tokensPerTurn: number;
  completeAfter: number;
};
type Env = {
  AI: Ai;
};

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const json = (body: unknown, status = 200) => Response.json(body, { status });
const valid = (value: unknown): value is Input => {
  if (!value || typeof value !== 'object') return false;
  const input = value as Record<string, unknown>;
  return (
    typeof input.prompt === 'string' &&
    input.prompt.length > 0 &&
    input.prompt.length <= 2_000 &&
    ['maxTurns', 'maxTokens', 'tokensPerTurn', 'completeAfter'].every(
      (key) =>
        Number.isSafeInteger(input[key]) && Number(input[key]) > 0 && Number(input[key]) <= 10_000,
    )
  );
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') {
      return json({
        ok: true,
        pattern: 'bounded-loop',
        primitives: ['Cloudflare Workers', 'Workers AI'],
        model: MODEL,
      });
    }
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
    const outputs: string[] = [];
    const result = (stop: Stop) => json({ stop, turns, tokens, outputs, model: MODEL });

    for (; turns < input.maxTurns; turns++) {
      // Reserve the declared per-turn model budget before invoking Workers AI.
      if (tokens + input.tokensPerTurn > input.maxTokens) return result('token-budget');
      tokens += input.tokensPerTurn;
      let inference: {
        response?: string;
        choices?: Array<{ text?: string; message?: { content?: string } }>;
      };
      try {
        inference = (await env.AI.run(MODEL, {
          messages: [
            {
              role: 'user',
              content: `${input.prompt}\n\nThis is bounded agent turn ${turns + 1}. Reply in one short sentence.`,
            },
          ],
          max_tokens: input.tokensPerTurn,
        })) as {
          response?: string;
          choices?: Array<{ text?: string; message?: { content?: string } }>;
        };
      } catch (error) {
        return json({ error: 'workers-ai-inference-failed', detail: String(error) }, 502);
      }
      const output =
        inference.response ??
        inference.choices?.[0]?.message?.content ??
        inference.choices?.[0]?.text;
      if (!output) return json({ error: 'workers-ai-empty-response' }, 502);
      outputs.push(output);
      if (turns + 1 >= input.completeAfter) {
        turns++;
        return result('complete');
      }
    }
    return result('turn-budget');
  },
};
