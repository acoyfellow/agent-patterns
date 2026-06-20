# Agent Patterns

A deliberately small catalog of agent execution patterns proven on Cloudflare. The generated field guide is live at **[agent-patterns.coey.dev](https://agent-patterns.coey.dev)**.

The catalog contains only patterns with runnable source, an isolated Alchemy deployment, real HTTPS assertions, automatic cleanup, and a sanitized proof receipt. Ideas without that evidence are not advertised.

## Proven catalog

| Pattern | Cloudflare primitive | Source and proof |
|---|---|---|
| Bound every loop | Workers | [`examples/bounded-loop`](examples/bounded-loop) |

The Worker makes turn and token limits program properties and returns typed `complete`, `turn-budget`, or `token-budget` stop reasons. It does not call a model: the example proves the control mechanism without requiring a secret or pretending deterministic work is inference.

## Verify

```sh
bun install
bun run check
bun run e2e
```

`e2e` deploys a unique Alchemy stage to the authenticated Cloudflare account, makes live HTTPS requests, checks all three stop paths, and destroys the stage in `finally`. Cloudflare credentials are read from the local environment and are never exposed to the Worker.

## Repository map

- `examples/bounded-loop/manifest.ts` — canonical metadata consumed by the site
- `examples/bounded-loop/worker.ts` — runnable Cloudflare Worker
- `examples/bounded-loop/alchemy.run.ts` — isolated deployment
- `examples/bounded-loop/e2e.ts` — live probes and cleanup trap
- `examples/bounded-loop/evidence/` — sanitized live receipt
- `src/build.ts` — static site generator from proven manifests
- `worker.ts` / `alchemy.run.ts` — binding-free static site Worker and custom domain

## Deploy the site

```sh
bun run deploy
```

The public site has static assets only: no secrets, forms, analytics, or sensitive bindings. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

MIT © Jordan Coeyman
