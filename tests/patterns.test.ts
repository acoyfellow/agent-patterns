import { describe, expect, test } from 'bun:test';
import { boundedLoop } from '../examples/bounded-loop.ts';
import { patterns } from '../src/patterns.ts';

describe('pattern catalog', () => {
  test('has unique complete entries', () => {
    expect(patterns.length).toBe(6);
    expect(new Set(patterns.map(({ slug }) => slug)).size).toBe(patterns.length);
    for (const pattern of patterns) expect(pattern.mechanism.length).toBeGreaterThanOrEqual(3);
  });
});

describe('bounded loop', () => {
  test('stops at the turn budget', async () => {
    const result = await boundedLoop(
      { done: false, tokens: 0, value: '' },
      { maxTurns: 2, maxTokens: 99 },
      async (state) => ({ ...state, tokens: state.tokens + 1 }),
    );
    expect(result.stop).toBe('turn-budget');
    expect(result.state.tokens).toBe(2);
  });
  test('returns completed work', async () => {
    const result = await boundedLoop(
      { done: false, tokens: 0, value: '' },
      { maxTurns: 3, maxTokens: 99 },
      async (state) => ({ ...state, done: true, value: 'evidence' }),
    );
    expect(result).toMatchObject({ stop: 'complete', state: { value: 'evidence' } });
  });
});
