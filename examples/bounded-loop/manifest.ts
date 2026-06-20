export const manifest = {
  slug: 'bounded-loop',
  number: '01',
  name: 'Bound every loop',
  promise: 'A Cloudflare Worker enforces turn and token reservations around real Workers AI calls.',
  useWhen: 'An agent iterates over model calls and must have a programmatic maximum cost.',
  primitive: 'Cloudflare Workers + Workers AI',
  mechanism: [
    'Bind Workers AI directly to the deployed Worker with Alchemy.',
    'Reserve the declared token allowance before every model inference.',
    'Return real model outputs with a typed, asserted stop reason.',
  ],
  source: 'examples/bounded-loop/worker.ts',
  code: `if (tokens + tokensPerTurn > maxTokens) return result('token-budget');
tokens += tokensPerTurn;
const inference = await env.AI.run(MODEL, { prompt, max_tokens: tokensPerTurn });
outputs.push(inference.response);`,
} as const;
