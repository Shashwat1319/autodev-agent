const rateMap = new Map<string, { count: number; resetAt: number }>();

function cleanExpired(): void {
  const now = Date.now();
  rateMap.forEach((val, key) => {
    if (now > val.resetAt) rateMap.delete(key);
  });
}

export function rateLimit(opts: {
  key: string;
  maxRequests?: number;
  windowMs?: number;
}): { allowed: boolean; remaining: number; resetIn: number } {
  const { key, maxRequests = 20, windowMs = 60000 } = opts;
  const now = Date.now();
  cleanExpired();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])|_){0,38}$/;

export function validateUsername(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 39) return null;
  if (!GITHUB_USERNAME_RE.test(trimmed)) return null;
  return trimmed;
}
