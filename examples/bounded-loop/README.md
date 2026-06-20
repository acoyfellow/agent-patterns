# Bounded Workers AI loop

A real Cloudflare Worker with a native Workers AI binding. Each admitted turn calls a deployed Workers AI model, records its response, and returns one of three typed stop reasons. The Worker reserves the caller-declared per-turn token allowance before inference, so it never starts a model call that exceeds the declared budget.

## Live proof

From the repository root:

```sh
CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_PERSONAL_ACCOUNT_ID" \
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_PERSONAL_API_TOKEN" \
bun run e2e
```

The command creates an isolated Alchemy stage with `AI: Ai()`, probes `/health` and `/run` over HTTPS, asserts non-empty output from `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, checks both budget stops, and destroys the Worker in a `finally` cleanup trap. Sanitized proof is stored under `evidence/`; credentials and temporary URLs are never committed.

## API

`POST /run` accepts `prompt` plus positive integers `maxTurns`, `maxTokens`, `tokensPerTurn`, and `completeAfter`. Values are capped at 10,000. `GET /health` identifies both Cloudflare primitives and the model.
