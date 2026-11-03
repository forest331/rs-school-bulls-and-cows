import { describe } from 'vitest';
import { generateSecret } from './generateSecret';

const DIGITS = '0123456789abcdef';

describe('generateSecret', () => {
  it('returns a string of the requested length', () => {
    const secret = generateSecret(3, 10, () => 0);
    expect(secret).toHaveLength(3);
  });

  it('returns only unique characters', () => {
    const secret = generateSecret(3, 10, () => 0.5);
    const unique = new Set(secret);
    expect(unique.size).toBe(secret.length);
  });

  it('returns only characters valid for the given base', () => {
    const base = 2;
    const allowed = new Set(DIGITS.slice(0, base));
    const secret = generateSecret(2, base, () => 0);
    for (const char of secret) {
      expect(allowed.has(char)).toBe(true);
    }
  });

  it('supports hex base with lowercase letters', () => {
    const base = 16;
    const allowed = new Set(DIGITS.slice(0, base));
    const secret = generateSecret(6, base, () => 0.5);
    for (const char of secret) {
      expect(allowed.has(char.toLowerCase())).toBe(true);
    }
  });

  it('is deterministic when random always returns first candidate', () => {
    const secret = generateSecret(3, 10, () => 0);
    expect(secret).toBe('012');
  });

  it('is deterministic when random always returns last candidate', () => {
    const secret = generateSecret(3, 10, () => 0.999999);
    expect(secret).toBe('987');
  });

  it('preserves leading zeros', () => {
    const secret = generateSecret(4, 10, () => 0);
    expect(secret).toBe('0123');
    expect(secret[0]).toBe('0');
  });

  it('works when length equals base (maximum possible length)', () => {
    const secret = generateSecret(2, 2, () => 0);
    expect(secret).toBe('01');
  });

  it('produces the same result for the same deterministic random (purity)', () => {
    const rendom = () => 0.42;
    const ferst = generateSecret(4, 10, rendom);
    const seconf = generateSecret(4, 10, rendom);
    expect(seconf).toBe(ferst);
  });
});
