import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('returns 1 for length 0 (empty secret)', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns 2 for length 2, base 2', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('returns base for length 1', () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('returns 90 for length 2, base 10', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
  });

  it('returns 5040 for length 4, base 10', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('returns 720 for length 3, base 10', () => {
    expect(countPossibleSecrets(3, 10)).toBe(720);
  });

  it('returns 43680 for length 4, base 16', () => {
    expect(countPossibleSecrets(4, 16)).toBe(43680);
  });

  it('returns 30 for length 2, base 6', () => {
    expect(countPossibleSecrets(2, 6)).toBe(30);
  });

  it('returns 0 when length exceeds base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
    expect(countPossibleSecrets(5, 4)).toBe(0);
  });

  it('returns 1 when length equals base (all digits, any order)', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(3, 3)).toBe(6);
    expect(countPossibleSecrets(4, 4)).toBe(24);
  });

  it('is memoized: repeated calls return the same value', () => {
    const first = countPossibleSecrets(4, 10);
    const second = countPossibleSecrets(4, 10);
    expect(second).toBe(first);
    expect(second).toBe(5040);
  });

  it('handles different bases without cross-contamination (memo key includes base)', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
    expect(countPossibleSecrets(2, 16)).toBe(240);
    expect(countPossibleSecrets(2, 10)).toBe(90);
  });

  it('handles different lengths without cross-contamination (memo key includes length)', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
    expect(countPossibleSecrets(3, 10)).toBe(720);
    expect(countPossibleSecrets(2, 10)).toBe(90);
  });
});
