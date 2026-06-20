export const manifest = {
  slug: 'bounded-loop',
  number: '01',
  name: 'Bound every loop',
  promise: 'A Cloudflare Worker enforces turn and token budgets before every unit of work.',
  useWhen: 'Work retries or iterates and must have a programmatic maximum cost.',
  primitive: 'Cloudflare Workers',
  mechanism: [
    'Validate explicit turn and token budgets at the HTTP boundary.',
    'Check both budgets before every simulated unit of work.',
    'Return the accumulated state and a typed, asserted stop reason.',
  ],
  source: 'examples/bounded-loop/worker.ts',
  code: `for (let turn = 0; turn < budget.maxTurns; turn++) {\n  if (tokens >= budget.maxTokens) return result('token-budget');\n  tokens += tokensPerTurn;\n  if (turn + 1 >= completeAfter) return result('complete');\n}\nreturn result('turn-budget');`,
} as const;
