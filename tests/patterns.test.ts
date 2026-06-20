import { describe, expect, test } from 'bun:test';
import { patterns } from '../src/patterns.ts';

describe('proven pattern catalog', () => {
  test('contains only the manifest-backed Cloudflare example', () => {
    expect(patterns.length).toBe(1);
    expect(patterns[0]).toMatchObject({
      slug: 'bounded-loop',
      primitive: 'Cloudflare Workers + Workers AI',
      source: 'examples/bounded-loop/worker.ts',
    });
    expect(new Set(patterns.map(({ slug }) => slug)).size).toBe(patterns.length);
  });

  test('does not claim local or simulated work', () => {
    const catalog = JSON.stringify(patterns);
    expect(catalog).not.toContain('simulated');
    expect(catalog).toContain('env.AI.run');
  });
});
