import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit, validateUsername } from './api-utils';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('allows first request', () => {
    const result = rateLimit({ key: 'test:1', maxRequests: 5, windowMs: 60000 });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.resetIn).toBeGreaterThan(0);
  });

  it('allows requests up to limit', () => {
    const key = 'test:2';
    for (let i = 0; i < 5; i++) {
      const result = rateLimit({ key, maxRequests: 5, windowMs: 60000 });
      if (i < 5) {
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }
    }
  });

  it('blocks requests over limit', () => {
    const key = 'test:3';
    for (let i = 0; i < 6; i++) {
      const result = rateLimit({ key, maxRequests: 5, windowMs: 60000 });
      if (i >= 5) {
        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
      }
    }
  });

  it('resets after window expires', () => {
    const key = 'test:4';
    rateLimit({ key, maxRequests: 1, windowMs: 10 });
    const blocked = rateLimit({ key, maxRequests: 1, windowMs: 10 });
    expect(blocked.allowed).toBe(false);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const allowed = rateLimit({ key, maxRequests: 1, windowMs: 10 });
        expect(allowed.allowed).toBe(true);
        resolve();
      }, 20);
    });
  });

  it('uses default values when not provided', () => {
    const result = rateLimit({ key: 'test:5' });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(19);
  });

  it('tracks separate keys independently', () => {
    rateLimit({ key: 'key-a', maxRequests: 1, windowMs: 60000 });
    expect(rateLimit({ key: 'key-a', maxRequests: 1, windowMs: 60000 }).allowed).toBe(false);
    expect(rateLimit({ key: 'key-b', maxRequests: 1, windowMs: 60000 }).allowed).toBe(true);
  });
});

describe('validateUsername', () => {
  it('accepts valid usernames', () => {
    expect(validateUsername('shashwat1319')).toBe('shashwat1319');
    expect(validateUsername('a')).toBe('a');
    expect(validateUsername('test-user')).toBe('test-user');
    expect(validateUsername('user123')).toBe('user123');
  });

  it('rejects non-strings', () => {
    expect(validateUsername(null)).toBeNull();
    expect(validateUsername(undefined)).toBeNull();
    expect(validateUsername(123)).toBeNull();
    expect(validateUsername([])).toBeNull();
    expect(validateUsername({})).toBeNull();
  });

  it('rejects empty or whitespace', () => {
    expect(validateUsername('')).toBeNull();
    expect(validateUsername('   ')).toBeNull();
  });

  it('trims whitespace', () => {
    expect(validateUsername('  user  ')).toBe('user');
  });

  it('rejects usernames with special characters', () => {
    expect(validateUsername('user name')).toBeNull();
    expect(validateUsername('user<script>')).toBeNull();
    expect(validateUsername('user@evil')).toBeNull();
    expect(validateUsername('../etc')).toBeNull();
  });

  it('rejects usernames exceeding 39 characters', () => {
    expect(validateUsername('a'.repeat(40))).toBeNull();
    expect(validateUsername('a'.repeat(39))).toBe('a'.repeat(39));
  });

  it('rejects usernames starting with hyphen', () => {
    expect(validateUsername('-user')).toBeNull();
  });
});
