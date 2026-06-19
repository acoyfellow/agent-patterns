import alchemy from 'alchemy';
import { Assets, CustomDomain, Worker } from 'alchemy/cloudflare';

const stage = process.env.STAGE ?? 'prod';
const hostname = process.env.SITE_HOSTNAME ?? 'agent-patterns.coey.dev';
const app = await alchemy('agent-patterns', { stage });
const assets = await Assets({ path: './dist' });
const worker = await Worker(`agent-patterns-${stage}`, {
  entrypoint: './worker.ts',
  compatibilityDate: '2026-06-19',
  adopt: true,
  assets: { run_worker_first: true },
  bindings: { ASSETS: assets },
});
if (stage === 'prod')
  await CustomDomain('agent-patterns-domain', {
    name: hostname,
    workerName: worker.name,
    adopt: true,
  });
console.log(worker.url);
if (stage === 'prod') console.log(`https://${hostname}`);
await app.finalize();
