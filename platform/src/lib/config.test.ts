import { describe, it, expect } from 'vitest';
import { BASE_URL } from './config';

describe('config', () => {
  it('BASE_URL is a non-empty string', () => {
    expect(typeof BASE_URL).toBe('string');
    expect(BASE_URL.length).toBeGreaterThan(0);
  });

  it('BASE_URL starts with https://', () => {
    expect(BASE_URL).toMatch(/^https:\/\//);
  });
});
