import { describe, it, expect } from 'vitest';
import { calculateScore } from './analyze-profile';

describe('calculateScore', () => {
  it('returns 0 for empty profile', () => {
    const result = calculateScore({ repoCount: 0, totalStars: 0, eventCount: 0, publicRepos: 0, hasBio: false });
    expect(result.consistencyScore).toBe(5);
    expect(result.overallScore).toBe(3);
  });

  it('rewards repos and stars', () => {
    const result = calculateScore({ repoCount: 10, totalStars: 50, eventCount: 20, publicRepos: 10, hasBio: true });
    expect(result.consistencyScore).toBe(100);
    expect(result.overallScore).toBe(100);
  });

  it('rewards having a bio', () => {
    const withBio = calculateScore({ repoCount: 1, totalStars: 1, eventCount: 1, publicRepos: 1, hasBio: true });
    const withoutBio = calculateScore({ repoCount: 1, totalStars: 1, eventCount: 1, publicRepos: 1, hasBio: false });
    expect(withBio.consistencyScore).toBeGreaterThan(withoutBio.consistencyScore);
  });

  it('consistencyScore maxes at 100', () => {
    const result = calculateScore({ repoCount: 100, totalStars: 1000, eventCount: 100, publicRepos: 50, hasBio: true });
    expect(result.consistencyScore).toBeLessThanOrEqual(100);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('rewards more events', () => {
    const active = calculateScore({ repoCount: 1, totalStars: 0, eventCount: 15, publicRepos: 1, hasBio: false });
    const inactive = calculateScore({ repoCount: 1, totalStars: 0, eventCount: 1, publicRepos: 1, hasBio: false });
    expect(active.consistencyScore).toBeGreaterThan(inactive.consistencyScore);
  });

  it('overallScore is average of consistency and star component', () => {
    const result = calculateScore({ repoCount: 5, totalStars: 10, eventCount: 5, publicRepos: 5, hasBio: true });
    const starComponent = Math.min(100, 10 * 2);
    const expected = Math.round((result.consistencyScore + starComponent) / 2);
    expect(result.overallScore).toBe(expected);
  });
});
