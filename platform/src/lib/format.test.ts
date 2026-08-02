import { describe, it, expect } from 'vitest';
import { getLangColor, getScoreHex, getScoreLabel, getScoreShieldsColor } from './format';

describe('getLangColor', () => {
  it('returns known language colors', () => {
    expect(getLangColor('JavaScript')).toBe('#f7df1e');
    expect(getLangColor('TypeScript')).toBe('#3178c6');
    expect(getLangColor('Python')).toBe('#3572A5');
    expect(getLangColor('Rust')).toBe('#dea584');
  });

  it('returns fallback for unknown languages', () => {
    expect(getLangColor('Brainfuck')).toBe('#666');
    expect(getLangColor('')).toBe('#666');
  });
});

describe('getScoreHex', () => {
  it('returns green for high scores', () => {
    expect(getScoreHex(100)).toBe('#4caf50');
    expect(getScoreHex(70)).toBe('#4caf50');
  });

  it('returns orange for medium scores', () => {
    expect(getScoreHex(69)).toBe('#ff9800');
    expect(getScoreHex(40)).toBe('#ff9800');
  });

  it('returns red for low scores', () => {
    expect(getScoreHex(39)).toBe('#f44336');
    expect(getScoreHex(0)).toBe('#f44336');
  });
});

describe('getScoreLabel', () => {
  it('labels high scores Great', () => {
    expect(getScoreLabel(100)).toBe('Great');
    expect(getScoreLabel(70)).toBe('Great');
  });

  it('labels medium scores Okay', () => {
    expect(getScoreLabel(69)).toBe('Okay');
    expect(getScoreLabel(40)).toBe('Okay');
  });

  it('labels low scores Needs Work', () => {
    expect(getScoreLabel(39)).toBe('Needs Work');
    expect(getScoreLabel(0)).toBe('Needs Work');
  });
});

describe('getScoreShieldsColor', () => {
  it('maps scores to shields.io colors', () => {
    expect(getScoreShieldsColor(100)).toBe('brightgreen');
    expect(getScoreShieldsColor(70)).toBe('brightgreen');
    expect(getScoreShieldsColor(69)).toBe('yellow');
    expect(getScoreShieldsColor(40)).toBe('yellow');
    expect(getScoreShieldsColor(39)).toBe('red');
    expect(getScoreShieldsColor(0)).toBe('red');
  });
});
