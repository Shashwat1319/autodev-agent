# ADR-002: No Database

## Status
Accepted

## Context
The application analyzes public GitHub profiles. Data is already hosted on GitHub's infrastructure. Storing it in a database would add complexity, cost, and synchronization concerns.

## Decision
Do not use a database. All profile data is fetched live from the GitHub API on every request. Cache headers (`s-maxage`) provide CDN-level caching.

## Consequences
- Zero database maintenance
- No sync issues (always fresh data)
- Higher latency for uncached requests
- Subject to GitHub API rate limits (60 req/hr unauthenticated, 5000 req/hr authenticated)

## Mitigation
The leaderboard could benefit from periodic caching, but this is acceptable at current scale.
