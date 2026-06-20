# Bounded loop on Cloudflare Workers

A real Worker that accepts a budget and returns one of three typed stop reasons. It has no bindings or secrets.

## Live proof

```sh
bun run e2e
```

The command creates an isolated Alchemy stage, probes `/health` and `/run` over HTTPS, asserts completion plus both exhaustion paths, and destroys the Worker in a `finally` cleanup trap. Save sanitized output under `evidence/`; never commit credentials or temporary deployment URLs.

## API

`POST /run` with positive integers `maxTurns`, `maxTokens`, `tokensPerTurn`, and `completeAfter`. Values are capped at 10,000. `GET /health` identifies the primitive.
