# ADR-001: In-Memory Rate Limiting

## Status
Accepted (with known limitations)

## Context
The application needs rate limiting to prevent API abuse. The platform runs on Vercel serverless functions which are stateless.

## Decision
Use an in-memory `Map` with per-key TTL tracking. Each serverless instance maintains its own map. On cold start, the map is empty.

## Consequences
- Simple implementation (no external service needed)
- Effective within a single server instance
- Bypassable on cold start (in-memory state resets)
- Not suitable for production at scale

## Mitigation
Replace with Vercel KV, Upstash Redis, or edge middleware when traffic warrants it. The current implementation is documented as defense-in-depth.
