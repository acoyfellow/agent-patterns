import { manifest as boundedLoop } from '../examples/bounded-loop/manifest.ts';

export type Pattern = {
  slug: string;
  number: string;
  name: string;
  promise: string;
  useWhen: string;
  primitive: string;
  mechanism: readonly string[];
  source: string;
  code: string;
};

// The site imports only manifests paired with runnable examples and live E2E receipts.
export const patterns: Pattern[] = [boundedLoop];
