import alchemy from 'alchemy';
import { Worker } from 'alchemy/cloudflare';

const stage = process.env.STAGE ?? 'e2e';
const app = await alchemy('ap-loop', { stage });
const worker = await Worker(`loop-${stage}`, {
  entrypoint: './worker.ts',
  compatibilityDate: '2026-06-19',
});
console.log(`E2E_URL=${worker.url}`);
await app.finalize();
