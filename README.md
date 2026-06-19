# Agent Patterns

A small, practical library for making agent execution bounded, steerable, observable, and cheaper to repeat. Read the visual field guide at **[agent-patterns.coey.dev](https://agent-patterns.coey.dev)**.

The premise: use model tokens to discover and build durable structure—rules, tests, harnesses, plans—rather than paying a model to rediscover that structure on every run. Keep inference for the fuzzy remainder.

## Quick start

```sh
git clone https://github.com/acoyfellow/agent-patterns.git
cd agent-patterns
bun install
bun run check
```

Open `dist/index.html` after the build, or inspect the runnable bounded-loop example in [`examples/bounded-loop.ts`](examples/bounded-loop.ts).

## The catalog

1. **Compile the fuzzy** — convert repeated judgment into deterministic checks.
2. **Bound every loop** — make turns, tokens, and time explicit program properties.
3. **Durable, flat workflow** — use named checkpointed steps instead of nested autonomy.
4. **Steering envelope** — scope tools, outputs, evidence, and spend.
5. **Harness before autonomy** — let real vertical tests define completion.
6. **Human checkpoint** — suspend before irreversible or expensive effects.

These compose. A production review loop might compile style rules into AST checks, run uncertain findings through a bounded agent inside a steering envelope, checkpoint each review in a Workflow, and request human approval before publishing.

## Apply a pattern

Start with the constraint, not the framework:

- repeated model judgment → **Compile the fuzzy**
- uncertain runtime or spend → **Bound every loop**
- retries and recovery → **Durable, flat workflow**
- broad capabilities → **Steering envelope**
- objectively testable goal → **Harness before autonomy**
- irreversible side effect → **Human checkpoint**

Copy the smallest mechanism that changes the failure mode. Keep stop reasons and evidence in your domain types. Test budget exhaustion as carefully as success.

## Project map

- `src/patterns.ts` — structured catalog and source snippets
- `src/build.ts` — deterministic static-site generator
- `examples/` — runnable TypeScript implementations
- `tests/` — behavior and catalog validation
- `public/` — visual system
- `worker.ts` / `alchemy.run.ts` — static Cloudflare Worker and custom domain

## Deploy

The site is static and has no secrets, service bindings, forms, analytics, or runtime data. Alchemy publishes the generated assets to a Cloudflare Worker:

```sh
CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_API_TOKEN=... bun run deploy
```

Use a narrowly scoped token with Workers Scripts and Zone edit access. `SITE_HOSTNAME` can override the default domain.

## Design notes

The visual language borrows the AX shape: dark technical surfaces, physical borders, compact mono labels, blue information, and Cloudflare orange for action. The catalog itself grew from a conversation about flattening loops: invest tokens in plans, static rules, vertical harnesses, and guardrails; then execute the remainder as a bounded workflow.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md). For vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

MIT © Jordan Coeyman
